"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BlogNavbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-white/10 py-4"
                    : "bg-transparent py-6"
            )}
        >
            <div className="container mx-auto px-6 flex items-center justify-between">
                <Link href="https://reshinrajesh.in" className="text-2xl font-bold tracking-tighter hover:text-primary transition-colors">
                    Reshin<span className="text-primary">.</span>
                </Link>

            </div>
        </nav>
    );
}
