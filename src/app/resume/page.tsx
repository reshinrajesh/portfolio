"use client";

import { RESUME_DATA } from "@/lib/resume-data";
import { Globe, Printer, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResumePage() {
    const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

    // Helper to check if an item relates to the selected skill
    // Note: This relies on description or techStack containing the skill string
    // For a real app, you might want explicit tags on work items too.
    const isRelated = (text: string | string[]) => {
        if (!selectedSkill) return true;
        if (Array.isArray(text)) {
            return text.some(t => t.toLowerCase().includes(selectedSkill.toLowerCase()));
        }
        return text.toLowerCase().includes(selectedSkill.toLowerCase());
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <main className="container relative mx-auto scroll-my-12 overflow-auto p-4 md:p-16 print:p-0">

            <motion.section
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="mx-auto w-full max-w-2xl bg-white text-black print:text-black space-y-8 print:space-y-4"
            >

                {/* Header */}
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{RESUME_DATA.name}</h1>
                        <p className="text-pretty max-w-md text-sm text-gray-600 font-mono">
                            {RESUME_DATA.summary}
                        </p>
                        <div className="flex items-center gap-x-3 text-sm text-gray-500 font-mono print:text-[10px]">
                            <p className="flex items-center gap-x-1">
                                <Globe className="h-3 w-3" />
                                {RESUME_DATA.location}
                            </p>
                            <Link href={RESUME_DATA.personalWebsiteUrl} className="flex items-center gap-x-1 hover:underline">
                                <LinkIcon className="h-3 w-3" />
                                {RESUME_DATA.personalWebsiteUrl.replace("https://", "")}
                            </Link>
                        </div>
                    </div>
                    <div className="hidden sm:block print:hidden">
                        <div className="h-24 w-24 rounded-xl bg-gray-100 border overflow-hidden">
                            <img src={RESUME_DATA.avatarUrl} alt={RESUME_DATA.name} className="object-cover w-full h-full" />
                        </div>
                    </div>
                </motion.div>

                {/* About */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-xl font-bold mb-2 border-b border-black/20">About</h2>
                    <p className="text-sm text-gray-700 text-pretty">
                        {RESUME_DATA.about}
                    </p>
                </motion.section>

                {/* Work Experience */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-xl font-bold mb-4 border-b border-black/20">Work Experience</h2>
                    <div className="space-y-6 print:space-y-4">
                        {RESUME_DATA.work.map((work) => {
                            // Simple heuristic: does description or title contain the skill?
                            const isActive = isRelated(work.description) || isRelated(work.title) || (work.badges && isRelated(work.badges));

                            return (
                                <motion.div
                                    key={work.company}
                                    className={`break-inside-avoid transition-opacity duration-300 ${!isActive ? 'opacity-30 print:opacity-100' : 'opacity-100'}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold">{work.company}</h3>
                                        <span className="text-sm text-gray-500 tabular-nums">
                                            {work.start} - {work.end}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm mb-1">
                                        <p className="">{work.title}</p>
                                        <span className="text-xs text-black/50 print:hidden">{work.badges.join(", ")}</span>
                                    </div>
                                    <p className="text-xs text-gray-600 text-pretty">
                                        {work.description}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.section>

                {/* Education */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-xl font-bold mb-4 border-b border-black/20">Education</h2>
                    <div className="space-y-4">
                        {RESUME_DATA.education.map((edu) => (
                            <div key={edu.school} className="break-inside-avoid">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold">{edu.school}</h3>
                                    <span className="text-sm text-gray-500 tabular-nums">
                                        {edu.start} - {edu.end}
                                    </span>
                                </div>
                                <p className="text-sm">{edu.degree}</p>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Skills */}
                <motion.section variants={itemVariants}>
                    <h2 className="text-xl font-bold mb-4 border-b border-black/20">Skills</h2>
                    <div className="flex flex-wrap gap-1">
                        {RESUME_DATA.skills.map((skill) => {
                            const isSelected = selectedSkill === skill;
                            return (
                                <button
                                    key={skill}
                                    onClick={() => setSelectedSkill(isSelected ? null : skill)}
                                    className={`
                    px-2 py-0.5 rounded-md text-[10px] uppercase font-bold transition-all
                    print:bg-transparent print:text-black print:border print:border-black/50
                    ${isSelected
                                            ? 'bg-black text-white scale-110 ring-2 ring-offset-2 ring-black'
                                            : 'bg-black/80 text-white hover:bg-black/60 hover:scale-105'}
                    ${selectedSkill && !isSelected ? 'opacity-40' : 'opacity-100'}
                `}
                                >
                                    {skill}
                                </button>
                            )
                        })}
                    </div>
                    <AnimatePresence>
                        {selectedSkill && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-2 text-xs text-muted-foreground flex items-center gap-2 print:hidden"
                            >
                                <span>Highlighting usage of <strong>{selectedSkill}</strong></span>
                                <button onClick={() => setSelectedSkill(null)} className="hover:text-black">
                                    <X size={12} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.section>

                {/* Projects */}
                <motion.section variants={itemVariants} className="print:break-inside-avoid">
                    <h2 className="text-xl font-bold mb-4 border-b border-black/20">Projects</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
                        {RESUME_DATA.projects.map((project) => {
                            const isActive = isRelated(project.techStack) || isRelated(project.description) || isRelated(project.title);

                            return (
                                <motion.div
                                    key={project.title}
                                    className={`
                    p-3 border border-gray-200 rounded-lg space-y-1 bg-gray-50/50 
                    print:border-black/50 print:bg-transparent transition-all duration-300
                    ${!isActive ? 'opacity-30 grayscale print:opacity-100 print:grayscale-0' : 'opacity-100'}
                `}
                                >
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-sm underline decoration-1 underline-offset-2">
                                            <a href={project.link.href} target="_blank" className="hover:text-blue-600">{project.title}</a>
                                        </h3>
                                        <div className="flex gap-1">
                                            {project.techStack.slice(0, 3).map(tech => (
                                                <span key={tech} className="text-[8px] px-1 bg-gray-200 rounded print:hidden">{tech}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-600">{project.description}</p>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.section>

            </motion.section>

            {/* Floating Action Button (Screen Only) */}
            <div className="fixed bottom-8 right-8 print:hidden z-50">
                <button
                    onClick={() => window.print()}
                    className="bg-black text-white p-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 font-bold"
                >
                    <Printer size={20} />
                    <span className="hidden md:inline">Print / Save PDF</span>
                </button>
            </div>

            {/* Return Home (Screen Only) */}
            <div className="fixed top-8 left-8 print:hidden z-50">
                <Link href="/" className="bg-white/80 backdrop-blur border text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
                    ← Back
                </Link>
            </div>

        </main>
    );
}

function LinkIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
    )
}
