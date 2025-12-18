import Link from "next/link";
import { Construction } from "lucide-react";

export default function BlogPage() {
    return (
        <section className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="bg-secondary/20 p-6 rounded-full mb-6">
                <Construction size={48} className="text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">
                    Coming Soon
                </span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto mb-8">
                I'm currently crafting some awesome content for you. Check back later for thoughts, stories, and ideas.
            </p>
            <Link
                href="https://reshinrajesh.in"
                className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:opacity-90 font-medium transition-opacity"
            >
                Back to Portfolio
            </Link>
        </section>
    );
}
