import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    const { email } = await request.json();

    if (!email) {
        return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const authenticators = await prisma.authenticator.findMany({
        where: { userId: user.id }
    });

    if (!authenticators || authenticators.length === 0) {
        return NextResponse.json({ error: 'No passkeys registered' }, { status: 400 });
    }

    const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

    const options = await generateAuthenticationOptions({
        rpID,
        allowCredentials: authenticators.map((auth: any) => ({
            id: auth.credentialID,
            transports: auth.transports ? JSON.parse(auth.transports) : undefined,
        })),
    });

    // Save challenge
    await prisma.user.update({
        where: { id: user.id },
        data: { current_challenge: options.challenge }
    });

    return NextResponse.json(options);
}
