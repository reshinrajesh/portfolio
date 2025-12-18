import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Check if the hostname is bio.reshinrajesh.in, blogs.reshinrajesh.in, or admin.reshinrajesh.in
    // We check for "bio." or "blog." at the start of the hostname

    // Skip middleware for API routes, static files, and ADMIN panel
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.') || url.pathname.startsWith('/admin')) {
        return NextResponse.next();
    }

    if (hostname.startsWith('bio.')) {
        // Rewrite the URL to the /bio path internally
        url.pathname = `/bio${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname.startsWith('blogs.')) {
        // Rewrite the URL to the /blogs path internally
        url.pathname = `/blogs${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname.startsWith('admin.')) {
        // Rewrite the URL to the /admin path internally
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
