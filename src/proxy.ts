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

    // --- GLOBAL MAINTENANCE OVERRIDE ---
    // Set to false to disable site-wide maintenance mode
    const MAINTENANCE_MODE = false;
    if (MAINTENANCE_MODE && !hostname.startsWith('status.') && url.pathname !== '/maintenance') {
        url.pathname = '/maintenance';
        return NextResponse.rewrite(url);
    }
    // -----------------------------------

    // Redirect /gallery on main domain to gallery subdomain
    if (url.pathname.startsWith('/gallery') && !hostname.startsWith('gallery.')) {
        return NextResponse.redirect(new URL('https://gallery.reshinrajesh.in'));
    }

    // Redirect /admin on main domain to admin subdomain
    if (url.pathname.startsWith('/admin') && !hostname.startsWith('admin.')) {
        try {
            const newUrl = new URL(request.url || "http://localhost:3000");
            newUrl.hostname = 'admin.reshinrajesh.in';
            // Remove /admin prefix since the subdomain rewrite handles it
            newUrl.pathname = url.pathname.replace(/^\/admin/, '');
            return NextResponse.redirect(newUrl);
        } catch (e) {
            return NextResponse.next();
        }
    }

    // Redirect /status on main domain to status subdomain
    if (url.pathname.startsWith('/status') && !hostname.startsWith('status.') && !hostname.startsWith('admin.')) {
        return NextResponse.redirect(new URL('https://status.reshinrajesh.in'));
    }

    // 1. Handle Admin Subdomain
    if (hostname.startsWith('admin.')) {
        // Allow access to login page
        if (url.pathname === '/login') {
            url.pathname = `/admin/login`;
            return NextResponse.rewrite(url);
        }

        // Redirect /admin to / on admin subdomain to avoid double nesting
        if (url.pathname.startsWith('/admin')) {
            try {
                const newUrl = new URL(request.url || "http://localhost:3000");
                newUrl.pathname = url.pathname.replace(/^\/admin/, '') || '/';
                return NextResponse.redirect(newUrl);
            } catch (e) {
                return NextResponse.next();
            }
        }

        // Check for session
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
            cookieName: '__Secure-reshin-admin-session'
        });

        if (!token) {
            // Redirect to login if not authenticated
            try {
                const loginUrl = new URL('/login', request.url || "http://localhost:3000");
                return NextResponse.redirect(loginUrl);
            } catch (e) {
                // Fallback for static generation where request.url might be missing or invalid
                return NextResponse.redirect("http://localhost:3000/login");
            }
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

    // 4. Handle Gallery Subdomain
    if (hostname.startsWith('gallery.')) {
        url.pathname = `/gallery${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 5. Handle Demo Subdomain
    if (hostname.startsWith('demo.')) {
        url.pathname = `/demo${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 6. Handle Status Subdomain
    if (hostname.startsWith('status.')) {
        url.pathname = `/status${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
