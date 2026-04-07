import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
                token: { label: "Token", type: "text" } // Added token field
            },
            async authorize(credentials) {
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                // 1. Magic Link Flow (Token based)
                if (credentials?.email && credentials?.token) {
                    const tokenData = await prisma.verificationToken.findFirst({
                        where: {
                            identifier: credentials.email,
                            token: credentials.token
                        }
                    });

                    if (tokenData && new Date(tokenData.expires) > new Date()) {
                        // Valid Token!
                        // cleanup
                        await prisma.verificationToken.delete({
                            where: { 
                                identifier_token: {
                                    identifier: credentials.email,
                                    token: credentials.token
                                }
                            }
                        });
                        return { id: "1", name: "Admin", email: adminEmail };
                    }

                    // If token invalid, fall through (or return null)
                    return null;
                }

                // 2. Passkey Flow (JSON password)
                if (credentials?.password?.startsWith('{')) {
                    try {
                        const response = JSON.parse(credentials.password);
                        const { verifyAuthenticationResponse } = await import('@simplewebauthn/server');

                        const user = await prisma.user.findUnique({
                            where: { email: credentials.email }
                        });

                        if (!user || !user.current_challenge) return null;

                        const authenticator = await prisma.authenticator.findUnique({
                            where: { credentialid: response.id }
                        });

                        if (!authenticator) return null;

                        const expectedRPID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
                        const expectedOrigin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

                        const verification = await verifyAuthenticationResponse({
                            response,
                            expectedChallenge: user.current_challenge,
                            expectedOrigin,
                            expectedRPID,
                            credential: {
                                id: authenticator.credentialid,
                                publicKey: new Uint8Array(Buffer.from(authenticator.credentialpublickey, 'base64')),
                                counter: authenticator.counter,
                                transports: authenticator.transports ? JSON.parse(authenticator.transports) : undefined,
                            }
                        });

                        if (verification.verified) {
                            await prisma.authenticator.update({
                                where: { credentialid: authenticator.credentialid },
                                data: { counter: verification.authenticationInfo.newCounter }
                            });

                            await prisma.user.update({
                                where: { id: user.id },
                                data: { current_challenge: null }
                            });

                            return { id: "1", name: "Admin", email: adminEmail };
                        }
                    } catch (e) {
                        console.error('Passkey login failed:', e);
                        return null;
                    }
                }

                // 3. Regular Password Flow
                if (
                    credentials?.email === adminEmail &&
                    credentials?.password === adminPassword
                ) {
                    return { id: "1", name: "Admin", email: adminEmail };
                }

                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt",
    },
    cookies: {
        sessionToken: {
            name: `__Secure-reshin-admin-session`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: true,
                domain: '.reshinrajesh.in'
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
