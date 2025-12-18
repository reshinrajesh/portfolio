import { supabase } from "@/lib/supabase-server";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

interface Post {
    id: string;
    title: string;
    content: string;
    created_at: string;
    tags: string[] | null;
}

export default async function BlogsPage() {
    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, content, created_at, tags')
        .eq('status', 'Published')
        .order('created_at', { ascending: false })
        .returns<Post[]>();

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <div className="mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Writings</h1>
                <p className="text-muted-foreground text-lg">Thoughts, tutorials, and insights on development.</p>
            </div>

            <div className="grid gap-8">
                {posts?.map((post) => (
                    <article key={post.id} className="group relative flex flex-col items-start bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/50 transition-all">
                        <h2 className="text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary mb-2">
                            <Link href={`/${post.id}`} className="absolute inset-0">
                                <span className="sr-only">Read {post.title}</span>
                            </Link>
                            {post.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 w-full">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                            {Array.isArray(post.tags) && post.tags.length > 0 && (
                                <div className="flex gap-2 ml-auto">
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-secondary px-2 py-0.5 rounded-full text-xs border border-border/50">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                            {post.content?.replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                        </p>
                        <div className="mt-4 text-primary font-medium text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            Read article <ArrowRight size={16} />
                        </div>
                    </article>
                ))}

                {(!posts || posts.length === 0) && (
                    <div className="text-center py-20 text-muted-foreground">
                        No posts found. check back later!
                    </div>
                )}
            </div>
        </div>
    )
}
