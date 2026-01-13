"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import VibeToggle from "./VibeToggle";


const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/#projects" },
    { name: "Gallery", href: "https://gallery.reshinrajesh.in" },
    { name: "Blogs", href: "https://blogs.reshinrajesh.in" },
    { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Logo />



                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <motion.div
                            key={link.name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Status Dropdown (Desktop) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Status
                            <ChevronDown size={14} className={`transition-transform duration-300 ${isStatusOpen ? "rotate-180" : ""}`} />
                        </button>

                        <AnimatePresence>
                            {isStatusOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-4 w-56 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-1.5 flex flex-col gap-1 backdrop-blur-xl"
                                >
                                    <Link
                                        href="/status"
                                        onClick={() => setIsStatusOpen(false)}
                                        className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-sm font-medium"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                        Dashboard
                                    </Link>

                                    <a
                                        href="https://res2.statuspage.io/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-white/10 text-zinc-300 hover:text-white transition-colors text-sm font-medium group"
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        Atlassian Page
                                        <ExternalLink className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity" size={12} />
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

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
                        className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-4 shadow-2xl"
                    >
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.name}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className="text-lg font-medium text-muted-foreground hover:text-foreground hover:pl-2 transition-all block py-3"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}

                        <div className="py-2 border-t border-white/5">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-1 mb-2 block">System Status</span>
                            <Link
                                href="/status"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 text-base font-medium text-zinc-400 hover:text-white py-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                Live Dashboard
                            </Link>
                            <a
                                href="https://res2.statuspage.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 text-base font-medium text-zinc-400 hover:text-white py-2"
                            >
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                Atlassian Page
                                <ExternalLink size={14} className="opacity-50" />
                            </a>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                            <span className="text-muted-foreground">Settings</span>
                            <div className="flex items-center gap-2">
                                <VibeToggle />
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
