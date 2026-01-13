import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .single();

    if (!user || !user.current_challenge) {
        return NextResponse.json({ error: 'User or challenge not found' }, { status: 400 });
    }

    const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
    const expectedOrigin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

    let verification;
    try {
        verification = await verifyRegistrationResponse({
            response: body,
            expectedChallenge: user.current_challenge,
            expectedOrigin,
            expectedRPID: rpID,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
        const { id: credentialID, publicKey: credentialPublicKey, counter, transports } = registrationInfo.credential;
        const { credentialDeviceType, credentialBackedUp } = registrationInfo;

        const { error } = await supabase.from('authenticators').insert({
            user_id: user.id,
            credentialID: credentialID,
            credentialPublicKey: Buffer.from(credentialPublicKey).toString('base64'),
            counter,
            credentialDeviceType,
            credentialBackedUp,
            transports: body.response.transports ? JSON.stringify(body.response.transports) : null,
        });

        if (error) {
            console.error(error);
            return NextResponse.json({ error: 'Failed to save authenticator' }, { status: 500 });
        }

        // Clear challenge
        await supabase.from('users').update({ current_challenge: null }).eq('id', user.id);

        return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
}
