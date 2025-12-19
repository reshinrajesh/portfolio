"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn, estimateReadingTime } from "@/lib/utils";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    tags?: string[];
    view_count?: number;
}

interface BlogCardProps {
    post: BlogPost;
    index: number;
    isSubdomain?: boolean;
}

export default function BlogCard({ post, index, isSubdomain = false }: BlogCardProps) {
    const readingTime = estimateReadingTime(post.content || '');

    // Extract a short excerpt (simple text extraction)
    const excerpt = post.content
        ? post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."
        : "No content available.";

    const href = isSubdomain ? `/${post.id}` : `/blogs/${post.id}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative flex flex-col h-full bg-card/50 border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:bg-card transition-all duration-300 shadow-sm hover:shadow-md"
        >
            <Link href={href} className="flex flex-col h-full p-6">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>
                            {new Date(post.updated_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{readingTime}</span>
                    </div>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {excerpt}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-wrap gap-2">
                        {post.tags && post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>

                    <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        Read <ArrowRight size={14} />
                    </span>
                </div>
            </Link>
        </motion.div>
    );
}
