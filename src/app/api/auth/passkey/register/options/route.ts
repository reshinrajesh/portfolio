import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user exists in our specific users table
        const { data: user, error: fetchError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('email', session.user.email)
            .single();

        let currentUser = user;

        if (fetchError || !user) {
            const { data: newUser, error: insertError } = await supabaseAdmin
                .from('users')
                .insert({ email: session.user.email })
                .select()
                .single();

            if (insertError) {
                console.error("Insert Error:", insertError);
                return NextResponse.json({ error: `Insert Failed: ${insertError.message}` }, { status: 500 });
            }
            currentUser = newUser;
        }

        // Get user's existing authenticators to prevent re-registration
        const { data: authenticators } = await supabaseAdmin
            .from('authenticators')
            .select('*')
            .eq('user_id', currentUser.id);

        const rpName = 'Reshin Portfolio Admin';
        const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(currentUser.id)),
            userName: currentUser.email,
            // Don't prompt if they already have one registered
            excludeCredentials: authenticators?.map((auth: any) => ({
                id: auth.credentialid,
                transports: auth.transports ? JSON.parse(auth.transports) : undefined,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: 'preferred',
                authenticatorAttachment: 'platform',
            },
        });

        // Save challenge to DB
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ current_challenge: options.challenge })
            .eq('id', currentUser.id);

        if (updateError) {
            return NextResponse.json({ error: `Challenge Save Error: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json(options);
    } catch (e: any) {
        console.error("Critical Error:", e);
        return NextResponse.json({ error: `Critical: ${e.message}` }, { status: 500 });
    }
}
