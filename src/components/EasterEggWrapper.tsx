"use client";

import { useKonamiCode } from "@/hooks/use-konami-code";
import MatrixRain from "./MatrixRain";
import { useEffect } from "react";

export function EasterEggWrapper() {
    const { triggered, setTriggered } = useKonamiCode();

    useEffect(() => {
        if (triggered) {
            const handleEscape = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    setTriggered(false);
                }
            };

            // Also close on click
            const handleClick = () => setTriggered(false);

            window.addEventListener("keydown", handleEscape);
            window.addEventListener("click", handleClick);

            return () => {
                window.removeEventListener("keydown", handleEscape);
                window.removeEventListener("click", handleClick);
            };
        }
    }, [triggered, setTriggered]);

    if (!triggered) return null;

    return <MatrixRain />;
}
