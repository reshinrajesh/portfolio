"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function Hero() {
    return (
        <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
            <div className="absolute inset-0 z-0" aria-hidden="true">
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-20 right-10 h-96 w-96 rounded-full bg-primary/20 blur-[128px]"
                />
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-10 h-64 w-64 rounded-full bg-accent-alt/20 blur-[100px]"
                />
            </div>

            <div className="relative z-10 container mx-auto px-6">
                <div className="max-w-3xl">
                    <p className="animate-fade-up text-eyebrow mb-6 uppercase text-muted-foreground">
                        Full Stack Developer &middot; Kerala, India
                    </p>

                    <h1 className="animate-fade-up delay-100 text-display mb-6">
                        Hi, I&apos;m{" "}
                        <span className="bg-gradient-to-r from-primary to-accent-alt bg-clip-text text-transparent">
                            Reshin Rajesh.
                        </span>
                    </h1>

                    <p className="animate-fade-up delay-200 text-lead mb-8 max-w-xl text-muted-foreground">
                        I build for the web by day and chase concerts and sunsets by night.
                        Half my life happens in a terminal, the other half on the road.
                    </p>

                    <div className="animate-fade-up delay-300 flex flex-wrap gap-4">
                        <Link
                            href="#projects"
                            className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                        >
                            View Projects <ArrowRight size={18} aria-hidden="true" />
                        </Link>
                        <Link
                            href="https://blogs.reshinrajesh.in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-full border border-border bg-secondary px-8 py-3 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                        >
                            Read the Blog <ExternalLink size={18} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                aria-hidden="true"
            >
                <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary to-transparent" />
            </motion.div>
        </section>
    );
}
