"use client";

import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import Link from "next/link";

export default function SupportWidget() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="my-16 p-8 rounded-3xl bg-gradient-to-br from-secondary/50 to-background border border-border/50 backdrop-blur-sm relative overflow-hidden group"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-500" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 md:shrink-0 transform md:-rotate-3 group-hover:rotate-0 transition-transform duration-300">
                    <Coffee className="text-white fill-white/20" size={32} />
                </div>

                <div className="flex-grow space-y-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                        Enjoyed the read?
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                        If you found this article helpful or specific code saved your day, consider buying me a coffee! It helps keep the servers running and the content flowing.
                    </p>
                </div>

                <div className="md:shrink-0">
                    <Link 
                        href="https://buymeacoffee.com/reshinrajesh" 
                        target="_blank"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-bold hover:opacity-90 transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                    >
                        <Heart size={18} className="fill-red-500 text-red-500 animate-pulse" />
                        <span>Buy me a coffee</span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
