import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const { data: projects } = await supabase.from('projects').select('slug');
    if (!projects) return [];
    return projects.map((project: any) => ({
        id: project.slug,
    }));
}

export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    // Fetch project
    const { data: project } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .single();

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
                <h1 className="text-title mb-4">{project.title}</h1>
                <div className="mb-6">
                    <div className="relative mb-6 h-64 w-full overflow-hidden rounded-xl bg-muted md:h-96">
                        {project.image ? (
                            <Image
                                src={project.image}
                                alt=""
                                fill
                                priority
                                className="object-cover"
                                sizes="(max-width: 896px) 100vw, 896px"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                No image yet
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-lead mb-6 text-muted-foreground">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                    {(project.tags || []).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

