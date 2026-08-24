import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
    ArrowLeft,
    ArrowLeftCircle,
    ArrowRightCircle,
    Check,
    ExternalLink,
    Github,
} from "lucide-react";

import ScrollProgress from "@/components/ScrollProgress";
import ShareButtons from "@/components/ShareButtons";
import { propertyUrl } from "@/lib/navigation";
import {
    getAdjacentProjects,
    getProjectBySlug,
    getProjects,
    hasCaseStudy,
    paragraphs,
    type Project,
} from "@/lib/projects";

export const revalidate = 60;

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
    const projects = await getProjects();

    return projects.map((project) => ({ id: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const project = await getProjectBySlug(id);

    if (!project) {
        return { title: "Project Not Found" };
    }

    const description = project.summary || project.description;
    const canonical = propertyUrl("www", `/projects/${project.slug}`);
    const image = project.image || "https://reshinrajesh.in/opengraph-image.png";

    return {
        title: `${project.title} | Reshin Rajesh`,
        description,
        alternates: { canonical },
        openGraph: {
            title: project.title,
            description,
            type: "article",
            url: canonical,
            images: [{ url: image }],
        },
        twitter: {
            card: "summary_large_image",
            title: project.title,
            description,
            images: [image],
        },
    };
}

function MetaChip({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-full border border-border bg-secondary/40 px-4 py-2">
            <span className="text-eyebrow uppercase text-muted-foreground">{label}</span>
            <span className="ml-2 text-sm font-medium text-foreground">{value}</span>
        </div>
    );
}

function Prose({ title, body }: { title: string; body: string | null | undefined }) {
    const blocks = paragraphs(body);

    if (blocks.length === 0) {
        return null;
    }

    return (
        <section className="mb-12">
            <h2 className="text-heading mb-4">{title}</h2>
            <div className="space-y-4">
                {blocks.map((block, index) => (
                    <p key={index} className="leading-relaxed text-muted-foreground">
                        {block}
                    </p>
                ))}
            </div>
        </section>
    );
}

function NeighbourLink({
    project,
    direction,
}: {
    project: Project;
    direction: "previous" | "next";
}) {
    const isNext = direction === "next";

    return (
        <Link
            href={`/projects/${project.slug}`}
            className={`group flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:border-primary/50 ${
                isNext ? "justify-end text-right" : ""
            }`}
        >
            {!isNext && (
                <ArrowLeftCircle
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                />
            )}
            <span className="min-w-0">
                <span className="text-eyebrow block uppercase text-muted-foreground">
                    {isNext ? "Next" : "Previous"}
                </span>
                <span className="block truncate font-medium transition-colors group-hover:text-primary">
                    {project.title}
                </span>
            </span>
            {isNext && (
                <ArrowRightCircle
                    size={20}
                    aria-hidden="true"
                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                />
            )}
        </Link>
    );
}

export default async function ProjectDetail({ params }: Props) {
    const { id } = await params;
    const project = await getProjectBySlug(id);

    if (!project) {
        notFound();
    }

    const { previous, next } = await getAdjacentProjects(project.slug);
    const detailed = hasCaseStudy(project);
    const highlights = project.highlights ?? [];
    const gallery = project.gallery ?? [];

    return (
        <article className="min-h-screen bg-background pb-24">
            <ScrollProgress />
            <ShareButtons title={project.title} />

            <div className="container mx-auto max-w-4xl px-6 pt-24">
                <Link
                    href="/#projects"
                    className="group mb-12 inline-flex items-center text-muted-foreground transition-colors hover:text-primary"
                >
                    <ArrowLeft
                        size={20}
                        aria-hidden="true"
                        className="mr-2 transition-transform group-hover:-translate-x-1"
                    />
                    Back to Projects
                </Link>

                <header className="mb-12">
                    <p className="text-eyebrow mb-4 uppercase text-muted-foreground">
                        {detailed ? "Case Study" : "Project"}
                    </p>

                    <h1 className="text-title mb-6">{project.title}</h1>

                    <p className="text-lead mb-8 max-w-2xl text-muted-foreground">
                        {project.summary || project.description}
                    </p>

                    {(project.role || project.year || project.status) && (
                        <div className="mb-8 flex flex-wrap gap-3">
                            {project.role && <MetaChip label="Role" value={project.role} />}
                            {project.year && <MetaChip label="Year" value={project.year} />}
                            {project.status && <MetaChip label="Status" value={project.status} />}
                        </div>
                    )}

                    {(project.demoLink || project.repoLink) && (
                        <div className="flex flex-wrap gap-4">
                            {project.demoLink && (
                                <Link
                                    href={project.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                >
                                    Live Site <ExternalLink size={16} aria-hidden="true" />
                                </Link>
                            )}
                            {project.repoLink && (
                                <Link
                                    href={project.repoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-full border border-border bg-secondary px-6 py-3 font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
                                >
                                    Source <Github size={16} aria-hidden="true" />
                                </Link>
                            )}
                        </div>
                    )}
                </header>

                <div className="relative mb-16 h-64 w-full overflow-hidden rounded-2xl border border-border bg-muted md:h-96">
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

                {/* Everything below is written material that may not exist yet, so
                    each block stands or falls on its own. With none of it, the page
                    is still a complete short-form project entry. */}
                {!detailed && (
                    <p className="mb-12 leading-relaxed text-muted-foreground">
                        {project.description}
                    </p>
                )}

                <Prose title="The problem" body={project.problem} />
                <Prose title="The approach" body={project.approach} />
                <Prose title="The outcome" body={project.outcome} />

                {highlights.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-heading mb-4">Highlights</h2>
                        <ul className="space-y-3">
                            {highlights.map((highlight) => (
                                <li key={highlight} className="flex items-start gap-3">
                                    <Check
                                        size={18}
                                        aria-hidden="true"
                                        className="mt-1 shrink-0 text-success"
                                    />
                                    <span className="text-muted-foreground">{highlight}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {project.content && (
                    <section
                        className="prose mb-12 max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-a:text-primary prose-code:text-foreground prose-img:rounded-xl"
                        dangerouslySetInnerHTML={{ __html: project.content }}
                    />
                )}

                {gallery.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-heading mb-6">Gallery</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {gallery.map((src) => (
                                <div
                                    key={src}
                                    className="relative aspect-video overflow-hidden rounded-xl border border-border bg-muted"
                                >
                                    <Image
                                        src={src}
                                        alt=""
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {project.tags && project.tags.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-eyebrow mb-4 uppercase text-muted-foreground">
                            Built with
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </section>
                )}

                {(previous || next) && (
                    <nav
                        aria-label="More projects"
                        className="flex flex-col gap-4 border-t border-border pt-8 sm:flex-row"
                    >
                        {previous && <NeighbourLink project={previous} direction="previous" />}
                        {next && <NeighbourLink project={next} direction="next" />}
                    </nav>
                )}
            </div>
        </article>
    );
}
