"use client";

import { useVibe } from "@/lib/VibeContext";
import { Terminal, Plane } from "lucide-react";
import { motion } from "framer-motion";

export default function VibeToggle() {
    const { vibe, toggleVibe } = useVibe();

    return (
        <button
            onClick={toggleVibe}
            className="relative h-8 w-14 rounded-full bg-secondary/50 p-1 transition-colors hover:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Toggle Vibe"
        >
            <motion.div
                className="flex items-center justify-center h-6 w-6 rounded-full bg-background shadow-sm text-primary"
                animate={{
                    x: vibe === "developer" ? 0 : 24,
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                {vibe === "developer" ? (
                    <Terminal size={14} />
                ) : (
                    <Plane size={14} className="text-orange-500" />
                )}
            </motion.div>
        </button>
    );
}
