'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Box, Layers, Zap } from 'lucide-react';
import React from 'react';

export default function Showcase3D() {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        x.set(clientX - left - width / 2);
        y.set(clientY - top - height / 2);
    }

    const rotateX = useTransform(mouseY, [-100, 100], [15, -15]);
    const rotateY = useTransform(mouseX, [-100, 100], [-15, 15]);

    return (
        <div className="h-full min-h-[300px] flex items-center justify-center perspective-1000">
            <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    x.set(0);
                    y.set(0);
                }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-64 h-80 rounded-3xl bg-gradient-to-br from-purple-500/20 to-blue-600/20 border border-white/10 backdrop-blur-xl shadow-2xl cursor-pointer group"
            >
                <div
                    className="absolute inset-4 rounded-2xl border border-white/20 bg-black/40 flex flex-col items-center justify-center gap-4 group-hover:bg-black/20 transition-colors"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
                        <Box className="w-8 h-8 text-white" />
                    </div>

                    <div className="text-center">
                        <h3 className="text-lg font-bold text-white mb-1">Glass 3D</h3>
                        <p className="text-xs text-white/50">Hover Interaction</p>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Layers size={16} className="text-purple-400" />
                        </div>
                        <div className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                            <Zap size={16} className="text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Reflection */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}
