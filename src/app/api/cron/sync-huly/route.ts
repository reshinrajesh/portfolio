import { NextResponse } from 'next/server';
import { performHulySync } from '@/lib/huly-sync';
import * as Sentry from '@sentry/nextjs';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        const syncResults = await performHulySync();

        return NextResponse.json({ 
            success: true, 
            message: 'Huly sync completed',
            results: syncResults
        });

    } catch (error: any) {
        console.error('Huly Sync Error:', error);
        Sentry.captureException(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
