"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { socials } from "@/lib/socials";
import Link from "next/link";
import { Send, Loader2, CheckCircle2 } from "lucide-react";

export default function Contact() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus("idle");
        setErrorMessage("");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
        };

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to send message");
            }

            setStatus("success");
            (e.target as HTMLFormElement).reset();
        } catch (error) {
            console.error("Error submitting form:", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="contact" className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Get in Touch</h2>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Have a project in mind, a question, or just want to connect? Reach out using the form below or through my social media.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="md:col-span-3 bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm"
                        >
                            {status === "success" ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                                    <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold">Message Sent!</h3>
                                    <p className="text-muted-foreground">
                                        Thanks for reaching out. I'll get back to you as soon as possible.
                                    </p>
                                    <button
                                        onClick={() => setStatus("idle")}
                                        className="mt-4 px-6 py-2 bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                                            <input
                                                id="name"
                                                name="name"
                                                type="text"
                                                required
                                                placeholder="John Doe"
                                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                required
                                                placeholder="john@example.com"
                                                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium text-foreground">Subject (Optional)</label>
                                        <input
                                            id="subject"
                                            name="subject"
                                            type="text"
                                            placeholder="What is this regarding?"
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={5}
                                            placeholder="Your message here..."
                                            className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    {status === "error" && (
                                        <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                                            {errorMessage}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3.5 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 flex items-center justify-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Social Links Grid */}
                        <motion.div
                            className="md:col-span-2 grid grid-cols-1 gap-4"
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
                                        className="h-full"
                                    >
                                        <Link
                                            href={social.link}
                                            target="_blank"
                                            className="bg-card p-5 rounded-2xl border border-border hover:border-primary/50 transition-colors group flex items-start sm:items-center sm:flex-row flex-col gap-4 h-full"
                                        >
                                            <div className="p-3 bg-background rounded-lg text-primary group-hover:bg-primary group-hover:text-background transition-colors shrink-0">
                                                <Icon size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{social.name}</h3>
                                                <p className="text-muted-foreground text-sm break-all">{social.display}</p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
