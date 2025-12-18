import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Skip middleware for API routes, static files
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    // 1. Handle Admin Subdomain
    if (hostname.startsWith('admin.')) {
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 2. Handle Blogs Subdomain
    if (hostname.startsWith('blogs.')) {
        url.pathname = `/blogs${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 3. Handle Bio Subdomain
    if (hostname.startsWith('bio.')) {
        url.pathname = `/bio${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
