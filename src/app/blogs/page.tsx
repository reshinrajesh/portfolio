import { supabase } from "@/lib/supabase-server";
import BlogNavbar from "@/components/BlogNavbar";
import BlogCard from "@/components/blog/BlogCard";
import ScrollProgress from "@/components/ScrollProgress";
import { Metadata } from "next";

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

    return (
        <main className="min-h-screen relative">
            <BlogNavbar />
            <ScrollProgress />

            <div className="container mx-auto px-6 py-32">
                <header className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        Latest Writings
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        Exploring code, design, and everything in between. Here's what I've been working on.
                    </p>
                </header>

                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {posts.map((post, index) => (
                            <BlogCard key={post.id} post={post} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/10 rounded-3xl border border-dashed border-border">
                        <h3 className="text-xl font-medium mb-2">No posts found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            I haven't published any blogs yet. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
}
