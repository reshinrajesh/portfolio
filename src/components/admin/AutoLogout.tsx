"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export default function AutoLogout() {
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const resetTimer = () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }

            timerRef.current = setTimeout(() => {
                // Determine if we should redirect to a specific login page or just reload
                signOut({ callbackUrl: "/login?reason=timeout" });
            }, TIMEOUT_MS);
        };

        // Events to listen for
        const events = [
            "mousemove",
            "keydown",
            "click",
            "scroll",
            "touchstart",
            "contextmenu"
        ];

        // Add listeners
        events.forEach((event) => {
            window.addEventListener(event, resetTimer);
        });

        // Initial set
        resetTimer();

        // Cleanup
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            events.forEach((event) => {
                window.removeEventListener(event, resetTimer);
            });
        };
    }, []);

    return null; // This component handles logic only, no UI
}
