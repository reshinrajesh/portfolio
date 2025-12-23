"use client";

import { Moon, Sun, Monitor, Coffee, Zap } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const themes = [
    { id: "dark", name: "Dark", icon: Moon, color: "bg-neutral-900" },
    { id: "light", name: "Light", icon: Sun, color: "bg-white" },
    { id: "cyberpunk", name: "Cyberpunk", icon: Zap, color: "bg-black border-pink-500" },
    { id: "coffee", name: "Coffee", icon: Coffee, color: "bg-[#2c241b] border-[#d4a373]" },
];

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-9 h-9" />;
    }

    const currentTheme = themes.find(t => t.id === theme) || themes[0];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-secondary/50 transition-colors flex items-center justify-center relative z-20"
                aria-label="Toggle theme"
            >
                <currentTheme.icon size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop to close */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 min-w-[140px] p-1 bg-popover border border-border rounded-xl shadow-lg z-20 overflow-hidden"
                        >
                            <div className="flex flex-col gap-1">
                                {themes.map((t) => (
                                    <button
                                        key={t.id}
                                        onClick={() => {
                                            setTheme(t.id);
                                            setIsOpen(false);
                                        }}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${theme === t.id
                                                ? "bg-accent text-accent-foreground font-medium"
                                                : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <t.icon size={16} />
                                        <span>{t.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
