"use client";

import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";
import Globe from "./Globe";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Elements */}
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30 md:opacity-50 pointer-events-auto">
                    <Globe />
                </div>

                {/* Ambient Gradients - Keeping these for atmosphere but softer */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-3xl">


                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-7xl font-bold tracking-tight mb-6 leading-tight"
                    >
                        Hi, I'm <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            Reshin Rajesh.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl text-muted-foreground mb-8 text-black dark:text-gray-300"
                    >
                        Crafting code during the day, chasing concerts and sunsets by night.
                        <br className="hidden md:block" />
                        A Full Stack Developer living life 50% in the terminal and 50% on the road.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-wrap gap-4"
                    >
                        <Link
                            href="#projects"
                            className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
                        >
                            View Projects <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="https://blogs.reshinrajesh.in"
                            target="_blank"
                            className="bg-secondary text-secondary-foreground border border-border px-8 py-3 rounded-full font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2"
                        >
                            Visit My Blogs <ExternalLink size={18} />
                        </Link>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-primary to-transparent" />
            </motion.div>
        </section >
    );
}
