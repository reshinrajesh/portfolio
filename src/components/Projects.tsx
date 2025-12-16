"use client";

import { motion } from "framer-motion";
import ProjectCard from "./ProjectCard";

const projects = [
    {
        title: "Night Guard - Womens Safety Robot",
        description: "A surveillance robot designed for women's safety in public places. Detects obstacles and unknown incidents, sending location and video footage to a nearby police station. Built with Arduino IDE.",
        tags: ["Arduino", "IoT", "C++", "Sensors"],
        image: "/robot-project.png",
        demoLink: "",
        repoLink: "",
    },
    {
        title: "Exam Conducting Application",
        description: "A comprehensive web application for conducting exams. Features user management for trainees/instructors and database creation. Built with Django and PostgreSQL.",
        tags: ["Django", "PostgreSQL", "Python", "HTML/CSS"],
        image: "/exam-project.png",
        demoLink: "",
        repoLink: "",
    },
];

export default function Projects() {
    return (
        <section id="projects" className="py-24">
            <div className="container mx-auto px-6">
                <div className="mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold mb-4"
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
                        A selection of my recent work and academic projects.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={index} {...project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
