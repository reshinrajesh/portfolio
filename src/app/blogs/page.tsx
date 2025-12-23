import { supabase } from "@/lib/supabase-server";
import BlogNavbar from "@/components/BlogNavbar";
import BlogCard from "@/components/blog/BlogCard";
import ScrollProgress from "@/components/ScrollProgress";
import Events from "@/components/Events";
import { Metadata } from "next";
import { headers } from "next/headers";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Blogs | Reshin Rajesh",
    description: "Thoughts, tutorials, and insights on web development and design.",
};

export default async function BlogsPage() {
    const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("status", "Published") // Only show published posts
        .order("created_at", { ascending: false });

    const headersList = await headers();
    const domain = headersList.get('host') || '';
    const isSubdomain = domain.startsWith('blogs.');

    return (
        <main className="min-h-screen relative">
            <BlogNavbar />
            <ScrollProgress />

            <Events />

            <div className="container mx-auto px-6 py-32">
                <header className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 pb-2">
                        Latest Writings
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Exploring code, design, and everything in between. Here's what I've been working on.
                    </p>
                </header>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} isSubdomain={isSubdomain} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl border border-dashed border-purple-500/20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <span className="text-2xl">✍️</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            Coming Soon
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            I'm currently crafting some deep dives and tutorials.
                            Stay tuned for the first drop!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
