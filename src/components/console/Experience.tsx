import { isCurrent, tenure, type Role } from "@/content/experience";
import SectionHead from "./SectionHead";

/**
 * Work history as a log rather than as cards.
 *
 * /work already uses side-by-side spec sheets, so repeating that shape here
 * would make two sections look like the same list twice. A single panel of
 * stacked rows, dates hanging in a left column, reads as a record instead -
 * and a record is what a career is.
 *
 * The current role is marked rather than merely first: order in the table is
 * editorial, so "which job is this person in now" has to be stated, not
 * inferred from position.
 */
export default function Experience({ roles }: { roles: Role[] }) {
    if (roles.length === 0) {
        return null;
    }

    return (
        <section id="experience" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
                <SectionHead
                    address="/experience"
                    name="Where I've worked"
                    meta={`${String(roles.length).padStart(2, "0")} records`}
                />

                <div className="border border-line-strong bg-panel">
                    {roles.map((role) => {
                        const current = isCurrent(role);
                        const span = tenure(role);
                        const href = role.link ?? "";

                        return (
                            <article
                                key={`${role.company}-${role.title}`}
                                className="grid gap-x-8 gap-y-2 border-b border-line px-4 py-4 last:border-b-0 md:grid-cols-[180px_minmax(0,1fr)]"
                            >
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 md:block">
                                    <span className="font-mono text-meta uppercase text-muted-foreground">
                                        {span}
                                    </span>
                                    {current ? (
                                        <span className="inline-flex items-center gap-1.5 font-mono text-label uppercase text-ok md:mt-1.5">
                                            <span
                                                aria-hidden="true"
                                                className="h-1.5 w-1.5 rounded-full bg-ok"
                                            />
                                            Current
                                        </span>
                                    ) : null}
                                </div>

                                <div className="min-w-0">
                                    <h3 className="font-mono text-heading text-balance">
                                        {role.title}
                                    </h3>

                                    <p className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-meta uppercase text-muted-foreground">
                                        {href ? (
                                            <a
                                                href={href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="transition-colors hover:text-primary"
                                            >
                                                {role.company}
                                            </a>
                                        ) : (
                                            <span>{role.company}</span>
                                        )}

                                        {(role.badges ?? []).map((badge) => (
                                            <span
                                                key={badge}
                                                className="border border-line-strong px-1.5 py-0.5 text-[10px] normal-case tracking-normal"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </p>

                                    {role.description ? (
                                        <p className="mt-2.5 max-w-[62ch] text-sm leading-relaxed text-muted-foreground">
                                            {role.description}
                                        </p>
                                    ) : null}
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
