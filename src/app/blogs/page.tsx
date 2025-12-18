import Link from "next/link";
import { Construction, ArrowLeft } from "lucide-react";

export const revalidate = 60;

export default function BlogsPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-8 animate-pulse">
                <Construction size={48} className="text-primary" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-4">Under Construction</h1>
            <p className="text-muted-foreground text-lg max-w-md mb-8">
                I'm currently writing some awesome content. Check back soon for tutorials, insights, and updates.
            </p>

            <Link
                href="https://reshinrajesh.in"
                className="flex items-center gap-2 text-primary hover:underline underline-offset-4 transition-all"
            >
                <ArrowLeft size={16} />
                Back to Portfolio
            </Link>
        </div>
    )
}
