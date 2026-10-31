import SectionHead from "./SectionHead";

const LOG = [
    { t: "Degree", d: "B.Tech, Computer Science", sub: "Srinivas University" },
    { t: "Diploma", d: "Cloud Computing", sub: null },
    { t: "Role", d: "Full-stack web developer intern", sub: "Interfaces + database layer" },
    { t: "Base", d: "Bengaluru, India", sub: "UTC+05:30" },
];

export default function About() {
    return (
        <section id="about" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
                <SectionHead address="/about" name="Background" />

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-7">
                    <div className="min-w-0 border border-line-strong bg-panel p-5">
                        <p className="mb-3.5 max-w-[58ch] leading-relaxed text-muted-foreground">
                            I am a Computer Science graduate (B.Tech) from{" "}
                            <strong className="font-medium text-foreground">Srinivas University</strong>,
                            with a Diploma in Cloud Computing alongside it.
                        </p>
                        <p className="mb-3.5 max-w-[58ch] leading-relaxed text-muted-foreground">
                            I cut my teeth as a full-stack web developer intern, building responsive
                            interfaces and then the database layer sitting behind them. That pairing
                            is still how I prefer to work — the part people touch and the part that
                            keeps their data straight are one problem seen from two ends.
                        </p>
                        {/* The terminal-and-road line belongs to the hero; repeating
                            it here made the same joke twice on one page. This closes on
                            the part the hero does not cover instead. */}
                        <p className="max-w-[58ch] leading-relaxed text-muted-foreground">
                            That habit now reaches past the browser. React Native means the same
                            end-to-end ownership on a phone, so a product does not stop at the
                            edge of a tab.
                        </p>
                    </div>

                    <dl className="grid min-w-0 content-start border border-line-strong bg-panel p-5">
                        {LOG.map((row) => (
                            <div
                                key={row.t}
                                className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-3.5 border-b border-line py-2.5 last:border-b-0"
                            >
                                <dt className="font-mono text-label uppercase text-muted-foreground">
                                    {row.t}
                                </dt>
                                <dd className="min-w-0 text-sm">
                                    {row.d}
                                    {row.sub ? (
                                        <span className="mt-0.5 block font-mono text-meta text-muted-foreground">
                                            {row.sub}
                                        </span>
                                    ) : null}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
