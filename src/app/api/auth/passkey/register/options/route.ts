import { generateRegistrationOptions } from '@simplewebauthn/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Ensure user exists in our specific users table
        let user: any = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            try {
                user = await prisma.user.create({
                    data: { email: session.user.email }
                });
            } catch (insertError: any) {
                console.error("Insert Error:", insertError);
                return NextResponse.json({ error: `Insert Failed: ${insertError.message}` }, { status: 500 });
            }
        }

        // Get user's existing authenticators to prevent re-registration
        const authenticators = await prisma.authenticator.findMany({
            where: { userId: user.id }
        });

        const rpName = 'Reshin Portfolio Admin';
        const rpID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';

        const options = await generateRegistrationOptions({
            rpName,
            rpID,
            userID: new Uint8Array(Buffer.from(user.id)),
            userName: user.email,
            // Don't prompt if they already have one registered
            excludeCredentials: authenticators?.map((auth: any) => ({
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
        try {
            await prisma.user.update({
                where: { id: user.id },
                data: { current_challenge: options.challenge }
            });
        } catch (updateError: any) {
            return NextResponse.json({ error: `Challenge Save Error: ${updateError.message}` }, { status: 500 });
        }

        return NextResponse.json(options);
    } catch (e: any) {
        console.error("Critical Error:", e);
        return NextResponse.json({ error: `Critical: ${e.message}` }, { status: 500 });
    }
}
