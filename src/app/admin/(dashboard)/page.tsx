
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { supabase } from "@/lib/supabase-server";
import PostActions from "../PostActions";

export const revalidate = 0; // Disable caching for admin panel

export default async function AdminDashboard() {
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 sm:gap-0">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link
                    href="/admin/editor"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto justify-center"
                >
                    <PlusCircle size={20} />
                    Create New
                </Link>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Title</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-sm uppercase pending tracking-wider">Editor</th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {posts?.map((post) => (
                                <tr key={post.id} className="hover:bg-secondary/20 transition-colors group">
                                    <td className="px-4 py-3 font-medium text-lg">{post.title}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold tracking-wide border ${post.status === "Published" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}`}>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                                R
                                            </div>
                                            <span className="text-sm font-medium">Reshin</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right whitespace-nowrap">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity inline-block">
                                            <PostActions id={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {(!posts || posts.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <p className="mb-4 text-lg">No posts found.</p>
                        <Link
                            href="/admin/editor"
                            className="text-primary hover:underline underline-offset-4"
                        >
                            Create your first post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
