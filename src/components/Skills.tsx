"use client";

import { motion } from "framer-motion";
import { Code2, Database, Layout, Server, Settings, Terminal, Cloud, Cpu } from "lucide-react";

const skills = [
    { name: "HTML/CSS", icon: Layout, color: "text-orange-400" },
    { name: "JavaScript", icon: Code2, color: "text-yellow-300" },
    { name: "Python", icon: Code2, color: "text-blue-400" },
    { name: "Django", icon: Server, color: "text-green-600" },
    { name: "PostgreSQL", icon: Database, color: "text-blue-300" },
    { name: "Azure Fundamentals", icon: Cloud, color: "text-blue-500" },
    { name: "IoT", icon: Cpu, color: "text-purple-400" },
    { name: "Arduino", icon: Settings, color: "text-cyan-500" },
];

export default function Skills() {
    return (
        <section id="skills" className="py-24 bg-secondary/20">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-4"
                    >
                        Technical Skills
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl"
                    >
                        Technologies and tools I have worked with.
                    </motion.p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={skill.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors group"
                        >
                            <div className="mb-4 p-3 rounded-lg bg-background/50 w-fit group-hover:bg-primary/20 transition-colors">
                                <skill.icon size={24} className={`${skill.color}`} />
                            </div>
                            <h3 className="font-semibold text-lg">{skill.name}</h3>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
