"use client";

import { useEffect, useState } from "react";

const KONAMI_CODE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

export function useKonamiCode() {
    const [triggered, setTriggered] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            // Arrow keys might be case sensitive in some browsers? usually "ArrowUp" etc.
            // But standard interaction: "ArrowUp" is standard. "b" and "a" should be lowercased.

            const targetKey = KONAMI_CODE[index].toLowerCase();

            // Handle special keys that might not match lowercase if we strictly lowercase everything
            // "ArrowUp".toLowerCase() is "arrowup".
            // So let's compare lowercased versions.

            if (key === targetKey) {
                const nextIndex = index + 1;
                if (nextIndex === KONAMI_CODE.length) {
                    console.log("Konami Code Triggered! 🐇");
                    setTriggered(true);
                    setIndex(0);
                } else {
                    setIndex(nextIndex);
                }
            } else {
                setIndex(0);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [index]);

    return { triggered, setTriggered };
}
