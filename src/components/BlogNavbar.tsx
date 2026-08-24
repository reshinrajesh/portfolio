"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { primaryNav, propertyUrl } from "@/lib/navigation";
import { ThemeToggle } from "./ThemeToggle";

export default function BlogNavbar() {
    const [scrolled, setScrolled] = useState(false);

    // Same menu the portfolio renders, resolved against the blogs host, so the
    // chrome no longer diverges between properties.
    const navLinks = primaryNav("blogs");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
                scrolled
                    ? "border-b border-hairline bg-background/80 py-4 backdrop-blur-md"
                    : "bg-transparent py-6",
            )}
        >
            <div className="container mx-auto flex items-center justify-between px-6">
                <Link
                    href={propertyUrl("www")}
                    className="text-2xl font-bold tracking-tighter transition-colors hover:text-primary"
                >
                    Reshin<span className="text-primary">.</span>
                </Link>

                <div className="flex items-center gap-6">
                    <div className="hidden items-center gap-6 md:flex">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <ThemeToggle />
                </div>
            </div>
        </nav>
    );
}
