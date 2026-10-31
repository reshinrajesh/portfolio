"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { initFaro, setFaroRoute } from "@/lib/faro";

export default function FaroInitializer() {
    const pathname = usePathname();
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

    // There is no signed-in user to identify any more: the admin area and its
    // auth stack are gone, so every visitor is anonymous to telemetry.
    return null;
}
