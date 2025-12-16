"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardProps {
    title: string;
    description: string;
    tags: string[];
    image: string;
    demoLink?: string;
    repoLink?: string;
    index: number;
}

export default function ProjectCard({ title, description, tags, image, demoLink, repoLink, index }: ProjectCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group rounded-2xl bg-card border border-border overflow-hidden hover:border-primary/50 transition-colors flex flex-col h-full"
        >
            <div className="relative h-48 overflow-hidden bg-muted">
                {/* Placeholder for real image */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 group-hover:scale-105 transition-transform duration-300">
                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex items-center justify-center w-full h-full text-muted-foreground">
                            No Image
                        </div>
                    )}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {demoLink && (
                        <Link href={demoLink} target="_blank" className="p-3 bg-background rounded-full hover:text-primary transition-colors" title="View Demo">
                            <ExternalLink size={20} />
                        </Link>
                    )}
                    {repoLink && (
                        <Link href={repoLink} target="_blank" className="p-3 bg-background rounded-full hover:text-primary transition-colors" title="View Code">
                            <Github size={20} />
                        </Link>
                    )}
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-muted-foreground mb-4 text-sm leading-relaxed flex-grow">
                    {description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                    {tags.map((tag) => (
                        <span key={tag} className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground font-medium">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
