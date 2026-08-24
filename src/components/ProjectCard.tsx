"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export interface Project {
    title: string;
    description: string;
    tags: string[];
    image?: string;
    slug?: string;
    demoLink?: string;
    repoLink?: string;
}

export default function ProjectCard({
    title,
    description,
    tags,
    image,
    slug,
    demoLink,
    repoLink,
    index,
}: Project & { index: number }) {
    // The /projects/[slug] case studies existed but nothing ever linked to them.
    const caseStudy = slug ? `/projects/${slug}` : null;

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/50"
        >
            <div className="relative h-48 overflow-hidden bg-muted">
                {image ? (
                    <Image
                        src={image}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                        No image yet
                    </div>
                )}

                {(demoLink || repoLink) && (
                    <div className="absolute inset-0 flex items-center justify-center gap-4 bg-overlay opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                        {demoLink && (
                            <Link
                                href={demoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-background p-3 transition-colors hover:text-primary"
                                aria-label={`Open the live demo of ${title}`}
                            >
                                <ExternalLink size={20} aria-hidden="true" />
                            </Link>
                        )}
                        {repoLink && (
                            <Link
                                href={repoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-background p-3 transition-colors hover:text-primary"
                                aria-label={`View the source code for ${title}`}
                            >
                                <Github size={20} aria-hidden="true" />
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="flex flex-grow flex-col p-6">
                <h3 className="mb-2 text-xl font-bold transition-colors group-hover:text-primary">
                    {caseStudy ? (
                        <Link href={caseStudy} className="hover:underline">
                            {title}
                        </Link>
                    ) : (
                        title
                    )}
                </h3>

                <p className="mb-4 flex-grow text-sm leading-relaxed text-muted-foreground">
                    {description}
                </p>

                <div className="mt-auto flex flex-wrap items-center gap-2">
                    {tags?.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground"
                        >
                            {tag}
                        </span>
                    ))}
                    {caseStudy && (
                        <span className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-primary">
                            Read more
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </span>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
