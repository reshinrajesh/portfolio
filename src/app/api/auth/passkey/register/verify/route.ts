import { verifyRegistrationResponse } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

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
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 400 });
    }

    const { verified, registrationInfo } = verification;

    if (verified && registrationInfo) {
        const { id: credentialID, publicKey: credentialPublicKey, counter, transports } = registrationInfo.credential;
        const { credentialDeviceType, credentialBackedUp } = registrationInfo;

        try {
            await prisma.authenticator.create({
                data: {
                    user_id: user.id,
                    credentialid: credentialID,
                    credentialpublickey: Buffer.from(credentialPublicKey).toString('base64'),
                    counter,
                    credentialdevicetype: credentialDeviceType,
                    credentialbackedup: credentialBackedUp,
                    transports: body.response.transports ? JSON.stringify(body.response.transports) : null,
                }
            });
        } catch (error: any) {
            console.error("Prisma Insert Error:", error);
            return NextResponse.json({ error: `Failed to save authenticator: ${error.message}` }, { status: 500 });
        }

        // Clear challenge
        await prisma.user.update({
            where: { id: user.id },
            data: { current_challenge: null }
        });

        return NextResponse.json({ verified: true });
    }

    return NextResponse.json({ verified: false }, { status: 400 });
}
