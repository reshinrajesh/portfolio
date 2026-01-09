"use client";
import { useEffect, useRef } from "react";

export default function SpotlightCursor() {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (divRef.current) {
                divRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(255,255,255,0.06), transparent 40%)`;
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={divRef}
            className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block" // Hidden on mobile
            aria-hidden="true"
        />
    );
}
