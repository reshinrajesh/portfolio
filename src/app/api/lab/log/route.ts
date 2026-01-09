import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase-server'; // Using the existing server client

export async function POST(request: Request) {
    try {
        const { code, status } = await request.json();

        // Basic bot protection or validation could go here

        const ip = request.headers.get('x-forwarded-for') || 'unknown';
        const userAgent = request.headers.get('user-agent') || 'unknown';

        const { error } = await supabase
            .from('access_logs')
            .insert({
                attempt_code: code,
                status: status,
                ip_address: ip,
                user_agent: userAgent
            });

        if (error) {
            console.error('Log insert error:', error);
            // Don't fail the request if logging fails, just warn
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Log handler error:', error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
