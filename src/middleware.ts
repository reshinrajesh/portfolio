import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host') || '';

    // Skip middleware for API routes, static files
    // Removed /admin from the skip list to allow handling it below
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/_next') || url.pathname.includes('.')) {
        return NextResponse.next();
    }

    // 1. Handle Admin Subdomain
    if (hostname.startsWith('admin.')) {
        // Rewrite the URL to the /admin path internally
        url.pathname = `/admin${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 2. Handle Bio Subdomain
    if (hostname.startsWith('bio.')) {
        // Rewrite the URL to the /bio path internally
        url.pathname = `/bio${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 3. Handle Blogs Subdomain
    if (hostname.startsWith('blogs.')) {
        // Rewrite the URL to the /blogs path internally
        url.pathname = `/blogs${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // 4. Restrict access to /admin on non-admin domains (e.g. main domain)
    // If someone tries to access /admin directly on the main domain, redirect them to admin subdomain
    // We expect development usually on localhost, so we might want to allow it there or redirect to admin.localhost?
    // Start with redirecting if it's strictly /admin path usage.
    if (url.pathname.startsWith('/admin')) {
        // Construct the new URL on the admin subdomain
        // Strip the '/admin' prefix because the subdomain rewrite adds it back
        const newPath = url.pathname.replace(/^\/admin/, '') || '/';

        // Use the current protocol (http or https)
        const protocol = url.protocol;

        // Determine the new hostname
        // If on localhost, it might be tricky. Let's assume production 'reshinrajesh.in'.
        // If the user is on localhost, redirecting to admin.reshinrajesh.in might be annoying if they want to debug locally without internet or production data.
        // But the user specifically asked to remove reshinrajesh.in/admin.

        // Check if localhost
        if (hostname.includes('localhost')) {
            // Allow /admin on localhost for ease of development, OR redirect into admin.localhost if configured?
            // Let's Allow it for now to prevent lockout during dev.
            return NextResponse.next();
        }

        return NextResponse.redirect(new URL(newPath, `${protocol}//admin.reshinrajesh.in`));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
