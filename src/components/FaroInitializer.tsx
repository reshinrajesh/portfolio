"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { initFaro, setFaroRoute, setFaroUser } from "@/lib/faro";

export default function FaroInitializer() {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const lastRoute = useRef<string | null>(null);

    useEffect(() => {
        initFaro();
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
