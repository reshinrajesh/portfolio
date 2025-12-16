import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function ProjectDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <div className="min-h-screen bg-background p-8">
            <Link href="/#projects" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
                <ArrowLeft size={20} />
                Back to Projects
            </Link>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-4">Project {id} Details</h1>
                <p className="text-muted-foreground">
                    This is a placeholder for the detailed view of project {id}. In a real application, you would fetch project data based on this ID.
                </p>
            </div>
        </div>
    );
}
