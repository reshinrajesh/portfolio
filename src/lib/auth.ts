import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const adminEmail = process.env.ADMIN_EMAIL;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (!adminEmail || !adminPassword) {
                    throw new Error("Missing admin configuration");
                }

                // Passkey Flow
                if (credentials?.password?.startsWith('{')) {
                    try {
                        const response = JSON.parse(credentials.password);
                        const { verifyAuthenticationResponse } = await import('@simplewebauthn/server');
                        const { supabase } = await import('@/lib/supabase-server');

                        // Helper: Find user by email
                        const { data: user } = await supabase
                            .from('users')
                            .select('*')
                            .eq('email', credentials.email)
                            .single();

                        if (!user || !user.current_challenge) return null;

                        // Find authenticator
                        const { data: authenticator } = await supabase
                            .from('authenticators')
                            .select('*')
                            .eq('credentialID', response.id)
                            .single();

                        if (!authenticator) return null;

                        const expectedRPID = process.env.NEXT_PUBLIC_RP_ID || 'localhost';
                        const expectedOrigin = process.env.NEXT_PUBLIC_ORIGIN || 'http://localhost:3000';

                        const verification = await verifyAuthenticationResponse({
                            response,
                            expectedChallenge: user.current_challenge,
                            expectedOrigin,
                            expectedRPID,
                            credential: {
                                id: authenticator.credentialID,
                                publicKey: new Uint8Array(Buffer.from(authenticator.credentialPublicKey, 'base64')),
                                counter: authenticator.counter,
                                transports: authenticator.transports ? JSON.parse(authenticator.transports) : undefined,
                            }
                        });

                        if (verification.verified) {
                            // Update counter
                            await supabase
                                .from('authenticators')
                                .update({ counter: verification.authenticationInfo.newCounter })
                                .eq('credentialID', authenticator.credentialID);

                            // Clear challenge
                            await supabase.from('users').update({ current_challenge: null }).eq('id', user.id);

                            return { id: "1", name: "Admin", email: adminEmail };
                        }
                    } catch (e) {
                        console.error('Passkey login failed:', e);
                        return null;
                    }
                }

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
