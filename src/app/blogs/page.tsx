import { supabase } from "@/lib/supabase";
import BlogNavbar from "@/components/BlogNavbar";
import BlogCard from "@/components/blog/BlogCard";
import ScrollProgress from "@/components/ScrollProgress";
import Events from "@/components/Events";
import { Metadata } from "next";
import { headers } from "next/headers";

// Published posts change rarely; ISR keeps the list cheap to serve.
export const revalidate = 60;

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
                    <div className="text-center py-20 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl border border-dashed border-purple-500/20">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <span className="text-2xl">✍️</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
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
