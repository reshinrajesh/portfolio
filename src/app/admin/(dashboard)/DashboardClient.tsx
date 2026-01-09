"use client";

import { useState } from "react";
import Link from "next/link";
import { PlusCircle, Search, Filter, LayoutDashboard, FileText, CheckCircle2 } from "lucide-react";
import PostActions from "../PostActions";

interface Post {
    id: string;
    title: string;
    status: 'Draft' | 'Published';
    created_at: string;
    updated_at: string;
    view_count: number;
}

import BarChart from "@/components/ui/BarChart";
import { Eye } from "lucide-react";

export default function DashboardClient({ posts }: { posts: Post[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'All' | 'Published' | 'Draft'>("All");

    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === "All" || post.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: posts.length,
        published: posts.filter(p => p.status === 'Published').length,
        draft: posts.filter(p => p.status === 'Draft').length,
        totalViews: posts.reduce((acc, curr) => acc + (curr.view_count || 0), 0)
    };

    // Get top 5 posts by views
    const topPosts = [...posts]
        .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
        .slice(0, 5)
        .map(p => ({ label: p.title, value: p.view_count || 0 }));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header section with Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex items-center gap-4 hover:border-primary/50 transition-colors">
                    <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        <LayoutDashboard size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Posts</p>
                        <h3 className="text-2xl font-bold">{stats.total}</h3>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex items-center gap-4 hover:border-green-500/50 transition-colors">
                    <div className="p-3 bg-green-500/10 rounded-lg text-green-500">
                        <CheckCircle2 size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Published</p>
                        <h3 className="text-2xl font-bold">{stats.published}</h3>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex items-center gap-4 hover:border-yellow-500/50 transition-colors">
                    <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Drafts</p>
                        <h3 className="text-2xl font-bold">{stats.draft}</h3>
                    </div>
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl flex items-center gap-4 hover:border-blue-500/50 transition-colors">
                    <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                        <Eye size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total Views</p>
                        <h3 className="text-2xl font-bold">{stats.totalViews}</h3>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-6">Top Performing Posts</h3>
                    {topPosts.length > 0 ? (
                        <BarChart data={topPosts} />
                    ) : (
                        <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
                            No view data available yet
                        </div>
                    )}
                </div>
                <div className="bg-card/50 backdrop-blur-sm border border-border p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <Link
                            href="/editor"
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                        >
                            <div className="p-2 bg-primary/10 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <PlusCircle size={18} />
                            </div>
                            <span className="text-sm font-medium">Create New Post</span>
                        </Link>
                        <Link
                            href="/admin/skills"
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                        >
                            <div className="p-2 bg-purple-500/10 rounded-full text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Filter size={18} />
                            </div>
                            <span className="text-sm font-medium">Manage Skills</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card/30 p-4 rounded-xl border border-border/50">
                <div className="flex flex-1 gap-4 w-full sm:w-auto">
                    <div className="relative flex-1 sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-sm"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="pl-9 pr-8 py-2 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-primary appearance-none cursor-pointer text-sm hover:bg-secondary transition-colors"
                        >
                            <option value="All">All Status</option>
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                        </select>
                    </div>
                </div>
                <Link
                    href="/admin/editor"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 w-full sm:w-auto justify-center font-medium"
                >
                    <PlusCircle size={18} />
                    Create New
                </Link>
            </div>

            {/* Posts Table */}
            <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="p-4 pl-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Title</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Status</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Last Edited</th>
                                <th className="p-4 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Editor</th>
                                <th className="p-4 pr-6 font-semibold text-muted-foreground text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-primary/5 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">{post.title}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${post.status === "Published"
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.status === "Published" ? "bg-green-500" : "bg-yellow-500"
                                                }`}></span>
                                            {post.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-muted-foreground text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-foreground text-xs">
                                                {new Date(post.updated_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="text-[10px] opacity-70">
                                                {new Date(post.updated_at).toLocaleTimeString(undefined, {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">
                                                RR
                                            </div>
                                            <span className="text-xs text-muted-foreground">Reshin</span>
                                        </div>
                                    </td>
                                    <td className="p-4 pr-6">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                                            <PostActions id={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredPosts.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <div className="bg-secondary/50 p-4 rounded-full mb-4">
                            <Search size={32} className="opacity-50" />
                        </div>
                        <p className="mb-4 text-lg font-medium">No posts found</p>
                        <p className="text-sm opacity-60 mb-6 max-w-xs text-center">
                            {searchQuery
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "Get started by creating your first blog post to share your thoughts."}
                        </p>
                        {!searchQuery && (
                            <Link
                                href="/editor"
                                className="text-primary hover:underline underline-offset-4 flex items-center gap-2"
                            >
                                <PlusCircle size={16} />
                                Create your first post
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
