"use client";

import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function BlogPage() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-6">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
            </div>

            <div className="container mx-auto relative z-10 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                >
                    <div className="mb-8 p-4 bg-primary/10 rounded-full text-primary ring-1 ring-primary/20">
                        <Rocket size={48} />
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                            Coming Soon
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                        I'm currently crafting some personal stories and reflections.
                        <br className="hidden md:block" />
                        Stay tuned for my journal.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
