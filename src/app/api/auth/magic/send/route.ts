import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error("Missing server configuration");
        }

        const supabase = createClient(url, key);

        // 1. Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

        // 2. Save to DB (Clean up old tokens first)
        await supabase.from('verification_tokens').delete().eq('identifier', email);

        const { error: dbError } = await supabase.from('verification_tokens').insert({
            identifier: email,
            token: token,
            expires: expires.toISOString()
        });

        if (dbError) throw new Error("Database error: " + dbError.message);

        // 3. Send Email
        const resend = new Resend('re_M9SkUfAR_Lzt3ZEnVTZoJuQ2hi1pLk14s'); // User provided key
        // Construct Verify URL
        // Warning: Localhost issues if NEXT_PUBLIC_ORIGIN not set, default to request origin or hardcode for now
        const origin = process.env.NEXT_PUBLIC_ORIGIN || 'https://reshinrajesh.in'; // Fallback to live site
        const verifyUrl = `${origin}/admin/magic-verify?email=${encodeURIComponent(email)}&token=${token}`;

        const { error: emailError } = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Login to Admin Panel',
            html: `
                <body style="background: #000; color: #fff; font-family: sans-serif; padding: 20px;">
                    <div style="max-width: 500px; margin: 0 auto; border: 1px solid #333; border-radius: 10px; padding: 40px; text-align: center;">
                        <h1 style="margin-bottom: 20px;">Magic Link</h1>
                        <p style="color: #888; margin-bottom: 30px;">Click below to sign in instantly.</p>
                        <a href="${verifyUrl}" style="background: #fff; color: #000; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">Log In</a>
                        <p style="color: #444; font-size: 12px; margin-top: 30px;">Expires in 15 minutes.</p>
                    </div>
                </body>
            `
        });

        if (emailError) throw new Error("Resend error: " + emailError.message);

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Magic Send Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
