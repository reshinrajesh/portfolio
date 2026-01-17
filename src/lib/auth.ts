import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from '@supabase/supabase-js';

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
                    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                    const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
                    const supabase = createClient(url, key);

                    const { data: tokenData } = await supabase
                        .from('verification_tokens')
                        .select('*')
                        .eq('identifier', credentials.email)
                        .eq('token', credentials.token)
                        .single();

                    if (tokenData && new Date(tokenData.expires) > new Date()) {
                        // Valid Token!
                        // cleanup
                        await supabase.from('verification_tokens').delete().eq('token', credentials.token);
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
                        const { supabase } = await import('@/lib/supabase-server');

                        const { data: user } = await supabase
                            .from('users')
                            .select('*')
                            .eq('email', credentials.email)
                            .single();

                        if (!user || !user.current_challenge) return null;

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
                            await supabase
                                .from('authenticators')
                                .update({ counter: verification.authenticationInfo.newCounter })
                                .eq('credentialID', authenticator.credentialID);

                            await supabase.from('users').update({ current_challenge: null }).eq('id', user.id);

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
