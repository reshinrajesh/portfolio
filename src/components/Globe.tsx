"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { useSpring } from "react-spring";
import { useVibe } from "@/lib/VibeContext";

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { vibe } = useVibe();

    // Spring animation for smooth rotation control if needed, 
    // but cobe has built-in phi. We use spring for smooth vibe color transitions if we wanted,
    // but for now we'll just react to the vibe value for marker colors.

    const isTraveler = vibe === "traveler";
    const markerColor = isTraveler ? [1, 0.5, 0] : [0.2, 0.4, 1]; // Orange vs Blue
    const glowColor = isTraveler ? [1, 0.5, 0] : [0.2, 0.4, 1];

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: markerColor as [number, number, number],
            glowColor: glowColor as [number, number, number],
            markers: [
                // Mumbai
                { location: [19.0760, 72.8777], size: 0.1 },
                // Manali
                { location: [32.2432, 77.1892], size: 0.08 },
                // Kerala (Kochi)
                { location: [9.9312, 76.2673], size: 0.08 },
                // Gokarna
                { location: [14.5479, 74.3188], size: 0.08 },
            ],
            onRender: (state: any) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, [vibe, markerColor, glowColor]);

    return (
        <div className="flex items-center justify-center w-full h-full min-h-[400px] relative">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
                className="opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
        </div>
    );
}
