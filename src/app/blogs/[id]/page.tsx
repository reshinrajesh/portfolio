import { supabase } from "@/lib/supabase-server";
import { notFound, redirect } from "next/navigation";
import { Calendar, User, ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { estimateReadingTime } from "@/lib/utils";
import ScrollProgress from "@/components/ScrollProgress";
import ShareButtons from "@/components/ShareButtons";
import ViewCounter from "@/components/blog/ViewCounter";
import { getServerSession } from "next-auth";

import { headers } from "next/headers";

export const revalidate = 0;

interface Props {
    params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const { data: post } = await supabase
        .from("posts")
        .select("title, seo_title, seo_description")
        .eq("id", id)
        .single();

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: post.seo_title || `${post.title} | Reshin Rajesh`,
        description: post.seo_description || `Read ${post.title} by Reshin Rajesh.`,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { id } = await params;
    const session = await getServerSession();
    const headersList = await headers();
    const domain = headersList.get('host') || '';
    const isSubdomain = domain.startsWith('blogs.');

    const { data: post } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

    if (!post) {
        notFound();
    }

    // Security Check: If draft, only allow if session exists (admin)
    if (post.status === 'Draft' && !session) {
        notFound();
    }

    return (
        <article className="min-h-screen py-20 px-6 max-w-4xl mx-auto">
            <ScrollProgress />
            <ShareButtons title={post.title} />
            <Link
                href={isSubdomain ? "/" : "/blogs"}
                className="inline-flex items-center text-muted-foreground hover:text-primary mb-12 transition-colors group"
            >
                <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Blogs
            </Link>

            <header className="mb-12 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/70">
                        {post.title}
                    </span>
                </h1>

                <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                        <Calendar size={14} />
                        <span>
                            {new Date(post.updated_at).toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                        <BookOpen size={14} />
                        <span>
                            {estimateReadingTime(post.content || '')}
                        </span>
                    </div>
                    {/* View Counter & Logic */}
                    <ViewCounter id={post.id} count={post.view_count || 0} />

                    <div className="flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
                        <User size={14} />
                        <span>Reshin</span>
                    </div>
                </div>
            </header>

            <div className="bg-card/30 border border-border/50 rounded-2xl p-8 md:p-12 shadow-sm backdrop-blur-sm">
                <div
                    className="prose prose-lg prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg"
                    dangerouslySetInnerHTML={{ __html: post.content || "" }}
                />
            </div>

            <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-muted-foreground">
                <p>Thanks for reading!</p>
                <Link href={isSubdomain ? "/" : "/blogs"} className="text-primary hover:underline underline-offset-4">
                    Read more posts
                </Link>
            </div>
        </article>
    );
}
