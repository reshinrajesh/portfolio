"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export default function About() {
    return (
        <section id="about" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            About Me
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                            I am a Computer Science graduate (`B.Tech`) from <strong>Srinivas University</strong> with a Diploma in Cloud Computing. My journey includes hands-on experience as a Full Stack Web Developer Intern, where I honed my skills in responsive design and database integration.
                        </p>

                        <div className="space-y-8 mb-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" /> Experience
                                </h3>
                                <div className="pl-4 border-l-2 border-border ml-1 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <h4 className="font-medium text-foreground text-lg">Associate Professional Services Engineer</h4>
                                        <p className="text-sm text-primary font-medium">Seria Applied Research Pvt. Ltd. | May 2024 - Present</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Specializing in IT infrastructure management, storage administration, and cloud solutions. Providing professional support to help businesses scale efficiently with secure tech solutions.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <h4 className="font-medium text-foreground text-lg">Web Developer and Social Media Manager</h4>
                                        <p className="text-sm text-primary font-medium">The Print | June 2024 - December 2024</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Creating websites and managing social media platforms for various clients.
                                        </p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <h4 className="font-medium text-foreground text-lg">Full Stack Web Developer Intern</h4>
                                        <p className="text-sm text-primary font-medium">Vitvara Technologies | Jul 2023 - Aug 2023</p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Implemented responsive design principles to create a seamless user experience across various devices. Contributed to the development of database structures and integration with web applications.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" /> Education
                                </h3>
                                <div className="pl-4 border-l-2 border-border ml-1 space-y-6">
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <h4 className="font-medium text-foreground text-lg">B.Tech - Computer Science</h4>
                                        <p className="text-sm text-muted-foreground">Srinivas University | 2021 - 2024</p>
                                    </div>
                                    <div className="relative">
                                        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                                        <h4 className="font-medium text-foreground text-lg">Diploma in Cloud Computing</h4>
                                        <p className="text-sm text-muted-foreground">Nettur Technical Training Foundation | 2018 - 2021</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" /> Certifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        "Microsoft Azure Fundamentals (AZ-900)",
                                        "Fundamentals of IoT (Cisco)",
                                        "Intro to Programming Using JavaScript"
                                    ].map((cert, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-md">
                                            <CheckCircle2 size={16} className="text-primary flex-shrink-0" />
                                            <span>{cert}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
