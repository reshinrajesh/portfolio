"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Timeline from "./Timeline";

export default function About() {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-title mb-6">
                            About Me
                        </h2>
                        <p className="text-lead mb-6 text-muted-foreground">
                            I am a Computer Science graduate (B.Tech) from <strong>Srinivas University</strong>, with a Diploma in Cloud Computing. I cut my teeth as a Full Stack Web Developer intern, building responsive interfaces and the database layer behind them.
                        </p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <h3 className="text-heading mb-12 text-center">My Journey</h3>
                            <Timeline />
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
