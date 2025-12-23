"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { supabase } from "@/lib/supabase-client";

interface Skill {
    id: string;
    name: string;
    icon: string;
    color: string;
    order: number;
}

export default function Skills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSkills = async () => {
            const { data, error } = await supabase
                .from('skills')
                .select('*')
                .order('order', { ascending: true });

            if (!error && data) {
                setSkills(data);
            }
            setLoading(false);
        };

        fetchSkills();
    }, []);

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
                    {loading && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            Loading skills...
                        </div>
                    )}
                    {!loading && skills.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            No skills found in database.
                        </div>
                    )}
                    {skills.map((skill, index) => {
                        // Dynamically get the icon component
                        const IconComponent = (LucideIcons as any)[skill.icon] || LucideIcons.Code2;

                        return (
                            <motion.div
                                key={skill.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-card border border-white/5 hover:border-primary/50 transition-colors group"
                            >
                                <div className="mb-4 p-3 rounded-lg bg-background/50 w-fit group-hover:bg-primary/20 transition-colors">
                                    <IconComponent size={24} className={`${skill.color}`} />
                                </div>
                                <h3 className="font-semibold text-lg">{skill.name}</h3>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
