import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export default async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Skip middleware for API routes, static files
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    // 1. Handle Admin Subdomain
    if (hostname.startsWith('admin.')) {
        // Allow access to login page
        if (url.pathname === '/login') {
            url.pathname = `/admin/login`;
            return NextResponse.rewrite(url);
        }

        // Check for session
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: '__Secure-reshin-admin-session'
        });

        if (!token) {
            // Redirect to login if not authenticated
            const loginUrl = new URL('/login', request.url);
            return NextResponse.redirect(loginUrl);
        }

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
