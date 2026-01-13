import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: authenticators } = await supabase
        .from('authenticators')
        .select('*')
        .eq('user_id', user.id);

    if (!authenticators || authenticators.length === 0) {
        return NextResponse.json({ error: 'No passkeys registered' }, { status: 400 });
    }

    const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

    const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: authenticators.map(auth => ({
            id: auth.credentialID,
            transports: auth.transports ? JSON.parse(auth.transports) : undefined,
        })),
    });

    // Save challenge
    await supabase
        .from('users')
        .update({ current_challenge: options.challenge })
        .eq('id', user.id);

    return NextResponse.json(options);
}
