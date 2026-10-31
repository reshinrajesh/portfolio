import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RETIRED_HOSTS, propertyUrl } from '@/lib/navigation';

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
    // The status host used to be exempt so it could still report an outage.
    // That property is retired, so maintenance now applies everywhere.
    if (MAINTENANCE_MODE && url.pathname !== '/maintenance') {
        url.pathname = '/maintenance';
        return NextResponse.rewrite(url);
    }
    // -----------------------------------

    // Hosts the site no longer serves. The DNS still points here, so send the
    // visitor to the live site instead of rendering a 404 on a dead property.
    if (RETIRED_HOSTS.some((prefix) => hostname.startsWith(prefix))) {
        return NextResponse.redirect(propertyUrl('www'), 308);
    }

    // Paths the retired properties used to own on the main domain.
    if (/^\/(gallery|status|blogs|resume|projects|matrix)(\/|$)/.test(url.pathname)
        && !hostname.startsWith('admin.')) {
        return NextResponse.redirect(propertyUrl('www'), 308);
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


    // 2. Handle Bio Subdomain
    if (hostname.startsWith('bio.')) {
        url.pathname = `/bio${url.pathname}`;
        return NextResponse.rewrite(url);
    }




    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
