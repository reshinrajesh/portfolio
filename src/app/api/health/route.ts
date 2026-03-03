import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const status = {
        main: "operational",
        blog: "operational",
        security: "operational",
    };

    try {
        // 1. Check Database (Prisma)
        await prisma.siteContent.count();
    } catch (e) {
        console.error("Health check error:", e);
        status.blog = "degraded";
    }

    // 2. Check API / Main Site (Self)
    // If this code is running, the main server is technically up.
    // We could add more sophisticated checks here if needed.

    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        services: status
    });
}
