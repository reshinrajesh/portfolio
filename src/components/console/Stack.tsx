import SectionHead from "./SectionHead";

/**
 * The grouping is an editorial decision, not a database one: the skills table
 * stores a flat list with no category column, and "which layer does this
 * belong to" is a judgement the page should make rather than the CMS.
 *
 * Anything managed in the admin that is not already named here gets appended
 * under "Also", so adding a skill still shows up without silently landing in
 * the wrong column.
 */
const GROUPS: { title: string; items: string[] }[] = [
    { title: "Interface", items: ["React / Next.js", "React Native", "TypeScript", "Tailwind CSS", "Framer Motion"] },
    { title: "Server", items: ["Node.js", "Python / Django", "REST APIs"] },
    { title: "Data", items: ["PostgreSQL", "Supabase", "Schema design"] },
    { title: "Operate", items: ["Git", "Vercel", "Cloud computing", "System design"] },
];

/** Loose match, so "React/Next.js" from the CMS does not duplicate "React / Next.js". */
function normalise(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export default function Stack({ managedSkills = [] }: { managedSkills?: string[] }) {
    const known = new Set(GROUPS.flatMap((group) => group.items).map(normalise));
    const extra = managedSkills.filter((skill) => !known.has(normalise(skill)));

    const groups = extra.length > 0 ? [...GROUPS, { title: "Also", items: extra }] : GROUPS;

    return (
        <section id="stack" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
                <SectionHead address="/stack" name="What I reach for" />

                {/* Same split frame as the hero spec grid: container owns top and
                    left, cells own right and bottom, so the outer edge is drawn once
                    at any column count. This grid wraps far more often than that one
                    - five groups appear as soon as a managed skill is added. */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] border-l border-t border-line-strong bg-panel">
                    {groups.map((group) => (
                        <div
                            key={group.title}
                            className="min-w-0 border-b border-r border-line-strong px-4 py-4"
                        >
                            <h3 className="mb-2.5 font-mono text-label uppercase text-foreground">
                                {group.title}
                            </h3>
                            <ul className="grid gap-1.5">
                                {group.items.map((item) => (
                                    <li
                                        key={item}
                                        className="font-mono text-xs text-muted-foreground before:text-line-strong before:content-['·_']"
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
