"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { initFaro, setFaroRoute, setFaroUser } from "@/lib/faro";

export default function FaroInitializer() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const lastRoute = useRef<string | null>(null);

    // Wait for the browser to go idle before pulling in the SDK, so telemetry
    // never competes with hydration or the first images for bandwidth. Nothing
    // reported in the meantime is lost -- lib/faro buffers it.
    useEffect(() => {
        const start = () => void initFaro();

        if (typeof window.requestIdleCallback === "function") {
            const handle = window.requestIdleCallback(start, { timeout: 4000 });

            return () => window.cancelIdleCallback(handle);
        }

        // Safari has no requestIdleCallback; a timeout is close enough.
        const timer = window.setTimeout(start, 2000);

        return () => window.clearTimeout(timer);
    }, []);

    // App Router navigations never reload the page, so views have to be pushed
    // manually or every session collapses into its landing route.
    useEffect(() => {
        if (!pathname || lastRoute.current === pathname) {
            return;
        }

        setFaroRoute(pathname);
        lastRoute.current = pathname;
    }, [pathname]);

    useEffect(() => {
        if (status === "loading") {
            return;
        }

        setFaroUser(session?.user ?? null);
    }, [session, status]);

    return null;
}
