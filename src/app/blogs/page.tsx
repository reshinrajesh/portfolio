import { supabase } from "@/lib/supabase";
import BlogNavbar from "@/components/BlogNavbar";
import BlogCard from "@/components/blog/BlogCard";
import ScrollProgress from "@/components/ScrollProgress";
import Events from "@/components/Events";
import { Metadata } from "next";
import { headers } from "next/headers";

// This page reads the request host to decide whether it is being served from
// the blogs. subdomain, so it cannot be prerendered. It previously declared
// `revalidate = 60` alongside this, which force-dynamic silently voided.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Blogs | Reshin Rajesh",
    description: "99% Life Stories, 1% Tech Content. Sharing personal experiences and occasional code.",
};

export default async function BlogsPage() {
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'Published')
        .order('created_at', { ascending: false });

    const headersList = await headers();
    const domain = headersList.get('host') || '';
    const isSubdomain = domain.startsWith('blogs.');

    return (
        <main className="min-h-screen relative">
            <BlogNavbar />
            <ScrollProgress />



            <div className="container mx-auto px-6 py-32">
                <header className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-title mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text pb-2 text-transparent">
                        Latest Writings
                    </h1>
                    <p className="text-lead text-muted-foreground">
                        99% Life Stories, 1% Tech Content. Here's what I've been experiencing.
                    </p>
                </header>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map((post: any, index: number) => (
                            <BlogCard key={post.id} post={post} index={index} isSubdomain={isSubdomain} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gradient-to-br from-cat-story/5 to-cat-music/5 rounded-3xl border border-dashed border-cat-story/20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cat-story/10 flex items-center justify-center">
                            <span className="text-2xl">✍️</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cat-story to-cat-music">
                            Coming Soon
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            I'm currently documenting my latest adventures and life lessons.
                            The first story is on its way!
                        </p>
                    </div>
                )}
            </div>

            <Events />
        </main>
    );
}
