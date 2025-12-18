import Link from "next/link";
import { supabase } from "@/lib/supabase-server";
import { ArrowRight, Calendar, Clock, User, BookOpen } from "lucide-react";
import { estimateReadingTime } from "@/lib/utils";

import { headers } from "next/headers";

export const revalidate = 0;

export default async function BlogPage() {
    const headersList = await headers();
    const domain = headersList.get('host') || '';
    const isSubdomain = domain.startsWith('blogs.');

    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    return (
        <section className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
            <div className="mb-16 text-center">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                        My Journal
                    </span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Thoughts, stories, and ideas.
                </p>
            </div>

            <div className="space-y-8">
                {posts?.map((post) => (
                    <div key={post.id} className="bg-card border border-border rounded-xl p-8 hover:border-primary/50 transition-colors">
                        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>
                                    {new Date(post.updated_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>
                                    {new Date(post.updated_at).toLocaleTimeString(undefined, {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <User size={14} />
                                <span>Reshin</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <BookOpen size={14} />
                                <span>{estimateReadingTime(post.content || '')}</span>
                            </div>
                        </div>
                        <div className="prose prose-invert max-w-none mb-6 line-clamp-3" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
                        <Link href={isSubdomain ? `/${post.id}` : `/blogs/${post.id}`} className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform w-fit">
                            Read more <ArrowRight size={16} className="ml-1" />
                        </Link>
                    </div>
                ))}

                {(!posts || posts.length === 0) && (
                    <div className="text-center py-20 bg-secondary/20 rounded-xl">
                        <p className="text-xl text-muted-foreground">No posts published yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
