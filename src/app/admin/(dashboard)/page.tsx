import prisma from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export const revalidate = 0; // Disable caching for admin panel

export default async function AdminDashboard() {
    const posts = await prisma.post.findMany({
        orderBy: { created_at: 'desc' }
    }) as any[];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Manage your blog posts and content</p>
            </div>

            <DashboardClient posts={posts || []} />
        </div>
    );
}
