import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/lib/projects";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return projects.map((project) => ({
        id: project.slug,
    }));
}

export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const project = projects.find((p) => p.slug === id);

    if (!project) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <Link href="/#projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft size={20} />
                Back to Projects
            </Link>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                <div className="mb-6">
                    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-6">
                        {/* In a real app, use Next.js Image component here with project.image */}
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                            Project Image Placeholder
                        </div>
                    </div>
                </div>
                <p className="text-muted-foreground mb-6">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

