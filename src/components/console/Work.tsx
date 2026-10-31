import type { Project } from "@/lib/projects";
import SectionHead from "./SectionHead";

/**
 * One row of a sheet. Kept as a component because the label column has to line
 * up across both sheets - that alignment is most of what makes them read as
 * instruments rather than cards.
 */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="grid grid-cols-[84px_minmax(0,1fr)] items-baseline gap-3 border-b border-line px-4 py-2.5 last:border-b-0 font-mono text-xs">
            <dt className="text-label uppercase text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-words">{children}</dd>
        </div>
    );
}

/**
 * Renders the link if there is one, and says so plainly if there is not.
 *
 * Both projects currently have empty link columns, so the honest state is the
 * common one. A disabled-looking button that goes nowhere would be worse than
 * a sentence admitting there is nothing to open.
 */
function LinkOrNot({ href, missing }: { href: string | null; missing: string }) {
    if (!href) {
        return <span className="text-muted-foreground">{missing}</span>;
    }

    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
        >
            {href.replace(/^https?:\/\//, "")}
        </a>
    );
}

export default function Work({ projects }: { projects: Project[] }) {
    if (projects.length === 0) {
        return null;
    }

    return (
        <section id="work" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
                <SectionHead
                    address="/work"
                    name="Selected builds"
                    meta={`${String(projects.length).padStart(2, "0")} records`}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                    {projects.map((project, index) => (
                        <article
                            key={project.id}
                            className="flex min-w-0 flex-col border border-line-strong bg-panel"
                        >
                            <div className="flex items-center justify-between gap-3 border-b border-line-strong bg-raise px-4 py-2.5 font-mono text-label uppercase text-muted-foreground">
                                <span className="min-w-0 truncate">
                                    <span className="text-primary">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    {"  "}
                                    {project.slug}
                                </span>
                                {project.year ? <span className="shrink-0">{project.year}</span> : null}
                            </div>

                            <div className="px-4 py-4">
                                <h3 className="mb-2.5 font-mono text-heading text-balance">
                                    {project.title}
                                </h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {project.description}
                                </p>
                            </div>

                            <dl className="mt-auto border-t border-line">
                                {project.tags && project.tags.length > 0 ? (
                                    <Row label="Stack">
                                        <span className="flex flex-wrap gap-1.5">
                                            {project.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="whitespace-nowrap border border-line-strong px-1.5 py-0.5 text-[10.5px] text-muted-foreground"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </span>
                                    </Row>
                                ) : null}

                                <Row label="Demo">
                                    <LinkOrNot href={project.demoLink} missing="Not deployed" />
                                </Row>

                                <Row label="Source">
                                    <LinkOrNot href={project.repoLink} missing="Not public" />
                                </Row>
                            </dl>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
