import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Check if the hostname is bio.reshinrajesh.in (handling localhost for testing)
    // We check for "bio." at the start of the hostname
    if (hostname.startsWith('bio.')) {
        // Rewrite the URL to the /bio path internally
        url.pathname = `/bio${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
