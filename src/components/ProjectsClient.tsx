"use client";

import { motion } from "framer-motion";
import ProjectCard, { type Project } from "./ProjectCard";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
    return (
        <section id="projects" className="py-16 md:py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-title mb-4"
                    >
                        Featured Projects
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-muted-foreground max-w-2xl"
                    >
                        Things I have built, and what I learned building them.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.slug ?? project.title} {...project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
