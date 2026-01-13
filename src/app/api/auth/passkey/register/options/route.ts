import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user exists in our specific users table
    let { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

    if (!user) {
        const { data: newUser, error } = await supabase
            .from('users')
            .insert({ email: session.user.email })
            .select()
            .single();

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        user = newUser;
    }

    // Get user's existing authenticators to prevent re-registration
    const { data: authenticators } = await supabase
        .from('authenticators')
        .select('*')
        .eq('user_id', user.id);

    const rpName = 'Reshin Portfolio Admin';
    const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

    const options = await generateRegistrationOptions({
        rpName,
        rpID,
        userID: user.id,
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
    await supabase
        .from('users')
        .update({ current_challenge: options.challenge })
        .eq('id', user.id);

    return NextResponse.json(options);
}
