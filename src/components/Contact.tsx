"use client";

import { motion } from "framer-motion";
import { socials } from "@/lib/socials";
import Link from "next/link";

export default function Contact() {
    return (
        <section id="contact" className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto text-center"
                >
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
                    <p className="text-muted-foreground text-lg mb-12">
                        Have a project in mind or just want to chat? I'd love to hear from you.
                    </p>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={{
                            visible: { transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {socials.map((social) => {
                            const Icon = social.icon;
                            return (
                                <motion.div
                                    key={social.name}
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <Link
                                        href={social.link}
                                        target="_blank"
                                        className="bg-card p-6 rounded-2xl border border-border hover:border-primary/50 transition-colors group block h-full"
                                    >
                                        <div className="p-3 bg-background rounded-lg text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-background transition-colors">
                                            <Icon size={24} />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{social.name}</h3>
                                        <p className="text-muted-foreground text-sm break-all">{social.display}</p>
                                    </Link>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
