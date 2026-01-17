import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
        return NextResponse.json({
            status: 'error',
            message: 'Missing Env Vars',
            details: { hasUrl: !!url, hasKey: !!key }
        }, { status: 500 });
    }

    try {
        const supabase = createClient(url, key, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        // 1. Test Users Table Access
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('count', { count: 'exact', head: true });

        if (userError) throw new Error(`Users Table Error: ${userError.message}`);

        // 2. Test Verification Tokens Write
        const testToken = `debug-${Date.now()}`;
        const { error: insertError } = await supabase
            .from('verification_tokens')
            .insert({
                identifier: 'debug@test.com',
                token: testToken,
                expires: new Date(Date.now() + 1000 * 60).toISOString()
            });

        if (insertError) throw new Error(`Token Insert Error: ${insertError.message}`);

        // 3. Cleanup
        await supabase
            .from('verification_tokens')
            .delete()
            .eq('token', testToken);

        return NextResponse.json({
            status: 'success',
            message: 'Supabase Connection & Permissions OK',
            envConfigured: true
        });

    } catch (error: any) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
