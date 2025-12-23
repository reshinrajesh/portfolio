"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar, Plane, Music, MapPin } from "lucide-react";

interface TimelineItem {
    id: string;
    type: "experience" | "education" | "travel" | "concert";
    title: string;
    organization: string; // Or location for travel
    period: string;
    description?: string;
}

const TIMELINE_DATA: TimelineItem[] = [
    {
        id: "1",
        type: "experience",
        title: "Associate Professional Services Engineer",
        organization: "Seria Applied Research Pvt. Ltd.",
        period: "May 2024 - Present",
        description: "Specializing in IT infrastructure management, storage administration, and cloud solutions. Providing professional support to help businesses scale efficiently with secure tech solutions."
    },

    {
        id: "2",
        type: "experience",
        title: "Web Developer and Social Media Manager",
        organization: "The Print",
        period: "June 2024 - December 2024",
        description: "Creating websites and managing social media platforms for various clients."
    },
    {
        id: "2.5",
        type: "concert",
        title: "Coldplay Concert",
        organization: "Mumbai",
        period: "Jan 2025",
        description: "An unforgettable night of music and lights. (Dream Event)"
    },
    {
        id: "3",
        type: "education",
        title: "B.Tech - Computer Science",
        organization: "Srinivas University",
        period: "2021 - 2024",
        description: "Graduated with a focus on comprehensive computer science principles."
    },
    {
        id: "4",
        type: "experience",
        title: "Full Stack Web Developer Intern",
        organization: "Vitvara Technologies",
        period: "Jul 2023 - Aug 2023",
        description: "Implemented responsive design principles to create a seamless user experience across various devices. Contributed to the development of database structures and integration with web applications."
    },
    {
        id: "5",
        type: "education",
        title: "Diploma in Cloud Computing",
        organization: "Nettur Technical Training Foundation",
        period: "2018 - 2021",
        description: "Foundation in cloud infrastructure and networking."
    }
];

export default function Timeline() {
    return (
        <div className="relative max-w-3xl mx-auto py-10">
            {/* Vertical Line */}
            <div className="absolute left-[19px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

            {TIMELINE_DATA.map((item, index) => {
                const isEven = index % 2 === 0;

                // Determine icon and color based on type
                let icon = <Briefcase size={16} />;
                let colorClass = "bg-blue-500/20 text-blue-400";

                if (item.type === 'education') {
                    icon = <GraduationCap size={16} />;
                    colorClass = "bg-green-500/20 text-green-400";
                } else if (item.type === 'travel') {
                    icon = <Plane size={16} />;
                    colorClass = "bg-orange-500/20 text-orange-400";
                } else if (item.type === 'concert') {
                    icon = <Music size={16} />;
                    colorClass = "bg-pink-500/20 text-pink-400";
                }

                return (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`relative flex items-center justify-between mb-12 md:mb-24 ${isEven ? "md:flex-row-reverse" : "md:flex-row"
                            }`}
                    >
                        {/* Empty Space for alignment */}
                        <div className="hidden md:block w-5/12" />

                        {/* Center Dot */}
                        <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center z-10 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                            <div className={`w-3 h-3 rounded-full animate-pulse ${item.type === 'travel' || item.type === 'concert' ? 'bg-orange-500' : 'bg-primary'
                                }`} />
                        </div>

                        {/* Content Card */}
                        <div className="w-[calc(100%-60px)] md:w-5/12 pl-4 md:pl-0 ml-12 md:ml-0">
                            <div className={`relative p-6 border rounded-2xl backdrop-blur-sm transition-colors group ${item.type === 'travel' || item.type === 'concert'
                                ? 'bg-orange-500/5 border-orange-500/10 hover:border-orange-500/30'
                                : 'bg-secondary/10 border-secondary/20 hover:border-primary/30'
                                }`}>
                                {/* Icon Badge */}
                                <div className={`absolute -top-4 ${isEven ? "md:-right-4 left-4 md:left-auto" : "md:-left-4 left-4"} w-8 h-8 rounded-lg ${colorClass} flex items-center justify-center border border-white/5`}>
                                    {icon}
                                </div>

                                <div className="mb-2 flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                                    <Calendar size={12} />
                                    <span>{item.period}</span>
                                </div>

                                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-sm font-medium text-primary/80 mb-3 flex items-center gap-2">
                                    {item.type === 'travel' && <MapPin size={14} />}
                                    {item.organization}
                                </p>

                                {item.description && (
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
