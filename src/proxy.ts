import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RETIRED_HOSTS, propertyUrl } from '@/lib/navigation';

/**
 * Host routing for the two properties this app still serves.
 *
 * Most of what used to live here was an authentication gate for the admin
 * subdomain. That area is gone along with next-auth, so the proxy is now only
 * doing what its name suggests: mapping a host onto a path prefix, and sending
 * retired properties somewhere real.
 */
export default function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Skip API routes, static files and anything with an extension.
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    // --- GLOBAL MAINTENANCE OVERRIDE ---
    // Set to true to serve the maintenance page everywhere.
    const MAINTENANCE_MODE = false;
    if (MAINTENANCE_MODE && url.pathname !== '/maintenance') {
        url.pathname = '/maintenance';
        return NextResponse.rewrite(url);
    }
    // -----------------------------------

    // Hosts the site no longer serves. DNS still points here, so send the
    // visitor to the live site instead of rendering a 404 on a dead property.
    // `admin.` is in this list now: there is no admin area to reach.
    if (RETIRED_HOSTS.some((prefix) => hostname.startsWith(prefix))) {
        return NextResponse.redirect(propertyUrl('www'), 308);
    }

    // Paths the retired properties used to own on the main domain.
    if (/^\/(gallery|status|blogs|resume|projects|matrix|admin|bio)(\/|$)/.test(url.pathname)) {
        return NextResponse.redirect(propertyUrl('www'), 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
