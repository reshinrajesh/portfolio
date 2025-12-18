
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
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Blog Posts</h1>
                <Link
                    href="/admin/editor"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                    <PlusCircle size={20} />
                    Create New
                </Link>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-secondary/30">
                        <tr>
                            <th className="p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Title</th>
                            <th className="p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Status</th>
                            <th className="p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Last Edited</th>
                            <th className="p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Editor</th>
                            <th className="p-6 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {posts?.map((post) => (
                            <tr key={post.id} className="hover:bg-secondary/20 transition-colors group">
                                <td className="p-6 font-medium text-lg">{post.title}</td>
                                <td className="p-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${post.status === "Published" ? "bg-green-500/10 text-green-500 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="p-6 text-muted-foreground text-sm">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-foreground">
                                            {new Date(post.updated_at).toLocaleDateString(undefined, {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        <span className="text-xs opacity-70">
                                            {new Date(post.updated_at).toLocaleTimeString(undefined, {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            R
                                        </div>
                                        <span className="text-sm font-medium">Reshin</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PostActions id={post.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
