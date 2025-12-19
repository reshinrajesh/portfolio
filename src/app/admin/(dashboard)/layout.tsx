import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, ExternalLink, PlusCircle, Image as ImageIcon, UserCircle } from "lucide-react";
import SignOutButton from "./SignOutButton";
import Logo from "@/components/Logo";
import { authOptions } from "@/lib/auth";

export const metadata = {
    title: "Dashboard | Res.",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        // Basic protection: redirect to login if not authenticated
        // In a real app, you'd use middleware or a robust check
        redirect("/api/auth/signin?callbackUrl=/");
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border p-6 flex flex-col bg-card/50 backdrop-blur-sm">
                <Logo />
                <span className="text-xs font-normal text-muted-foreground block mt-1 tracking-normal">Admin Panel</span>

                <nav className="flex flex-col gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hover:translate-x-1"
                    >
                        <LayoutDashboard size={20} />
                        <span>All Posts</span>
                    </Link>
                    <Link
                        href="/editor"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hover:translate-x-1"
                    >
                        <PlusCircle size={20} />
                        <span>Create New</span>
                    </Link>
                    <Link
                        href="/media"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hover:translate-x-1"
                    >
                        <ImageIcon size={20} />
                        <span>Media Gallery</span>
                    </Link>
                    <Link
                        href="/profile"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/10 hover:text-primary transition-all text-muted-foreground hover:translate-x-1"
                    >
                        <UserCircle size={20} />
                        <span>Profile</span>
                    </Link>
                    <Link
                        href="https://blogs.reshinrajesh.in"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary hover:text-foreground transition-all text-muted-foreground"
                    >
                        <ExternalLink size={20} />
                        <span>View Blog</span>
                    </Link>

                    <div className="mt-auto pt-2 border-t border-border">
                        <SignOutButton />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
