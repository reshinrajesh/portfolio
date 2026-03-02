import { NextResponse } from 'next/server';
import { addIncident } from '@/app/status/actions';

export async function GET(request: Request) {
    // Basic protection to prevent random people from triggering it multiple times
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (key !== 'admin123') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await addIncident({
            title: "Emergency Infrastructure Maintenance",
            description: "We are currently conducting emergency infrastructure maintenance to migrate our backend database systems. During this window, all main site services will be temporarily unavailable. We apologize for the inconvenience and are working to restore service as quickly as possible.",
            status: "Investigating",
            date: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            message: "Incident successfully posted to the status history. You can now delete this file."
        });
    } catch (error: any) {
        console.error("Failed to insert incident:", error);
        return NextResponse.json({
            success: false,
            error: error.message || "An unknown error occurred while adding the incident."
        }, { status: 500 });
    }
}
