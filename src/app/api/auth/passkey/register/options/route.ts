import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            return NextResponse.json({ error: 'Server Config Error: Missing SUPABASE_SERVICE_ROLE_KEY' }, { status: 500 });
        }

        // Ensure user exists in our specific users table
        let { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

        // PGRST116 means no rows found, which is fine (we create one). 
        // Any other error means DB issue (e.g. table missing).
        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error("DB Error:", fetchError);
            return NextResponse.json({ error: `DB Error: ${fetchError.message} (${fetchError.code})` }, { status: 500 });
        }

        if (!user) {
            const { data: newUser, error: insertError } = await supabase
                .from('users')
                .insert({ email: session.user.email })
                .select()
                .single();

            if (insertError) {
                console.error("Insert Error:", insertError);
                return NextResponse.json({ error: `Insert Failed: ${insertError.message}` }, { status: 500 });
            }
            user = newUser;
        }

        // Get user's existing authenticators to prevent re-registration
        const { data: authenticators, error: authError } = await supabase
            .from('authenticators')
            .select('*')
            .eq('user_id', user.id);

        if (authError) {
            console.error("Auth Fetch Error:", authError);
            // We can proceed without exclusion if this fails, but better to report
            // return NextResponse.json({ error: `Auth Fetch Error: ${authError.message}` }, { status: 500 });
        }

        const rpName = 'Reshin Portfolio Admin';
        const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(user.id)),
            userName: user.email,
            // Don't prompt if they already have one registered
            excludeCredentials: authenticators?.map(auth => ({
                id: auth.credentialID,
                transports: auth.transports ? JSON.parse(auth.transports) : undefined,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });

        // Save challenge to DB
        const { error: updateError } = await supabase
            .from('users')
            .update({ current_challenge: options.challenge })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json({ error: `Challenge Save Error: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json(options);
    } catch (e: any) {
        console.error("Critical Error:", e);
        return NextResponse.json({ error: `Critical: ${e.message}` }, { status: 500 });
    }
}
