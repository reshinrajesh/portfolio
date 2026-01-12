"use client";

import createGlobe from "cobe";
import { useEffect, useRef } from "react";

export default function StatusGlobe() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
            markerColor: [0.1, 0.8, 0.1],
            glowColor: [0.1, 0.1, 0.1],
            markers: [
                // Random locations to simulate "nodes"
                { location: [37.7595, -122.4367], size: 0.03 }, // SF
                { location: [40.7128, -74.0060], size: 0.03 }, // NY
                { location: [51.5074, -0.1278], size: 0.03 }, // London
                { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
                { location: [35.6762, 139.6503], size: 0.03 }, // Tokyo
                { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
                { location: [19.0760, 72.8777], size: 0.03 }, // Mumbai
                { location: [55.7558, 37.6173], size: 0.03 }, // Moscow
                { location: [-23.5505, -46.6333], size: 0.03 }, // Sao Paulo
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // state will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.005;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <div className="w-full max-w-[600px] aspect-square mx-auto relative -my-24 opacity-80 mix-blend-screen pointer-events-none">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
                className="w-full h-full opacity-50"
            />
        </div>
    );
}
