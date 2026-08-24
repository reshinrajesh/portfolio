"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import VibeToggle from "./VibeToggle";
import { primaryNav, type PropertyId } from "@/lib/navigation";


export default function Navbar({ property = "www" }: { property?: PropertyId }) {
    const navLinks = primaryNav(property);
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Reads window directly rather than closing over `scrolled`, which with
        // an empty dep array stayed frozen at its first-render value forever.
        const handleScroll = () => setScrolled(window.scrollY > 20);

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 animate-slide-down",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-hairline py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Logo />



                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <motion.div
                            key={link.label}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.label}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Theme Toggle & Vibe Toggle */}
                    <div className="ml-4 flex items-center gap-2">
                        <VibeToggle />
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-foreground"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-hairline p-6 md:hidden flex flex-col gap-4 shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.label}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all block py-3"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}

                        <div className="mt-4 flex items-center justify-between border-t border-hairline pt-4">
                            <span className="text-muted-foreground">Settings</span>
                            <div className="flex items-center gap-2">
                                <VibeToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
