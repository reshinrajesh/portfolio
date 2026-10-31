import { education, profile } from "@/content/profile";
import { isCurrent, roles } from "@/content/experience";
import SectionHead from "./SectionHead";

const current = roles.find(isCurrent) ?? roles[0];

const LOG = [
    ...education.map((item) => ({
        t: item.kind,
        d: item.award,
        sub: item.short ?? item.institution,
    })),
    { t: "Now", d: current.title, sub: current.company },
    { t: "Base", d: profile.location, sub: profile.timezone },
];

export default function About() {
    return (
        <section id="about" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 sm:py-14">
                <SectionHead address="/about" name="Background" />

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-7">
                    <div className="min-w-0 border border-line-strong bg-panel p-5">
                        <p className="mb-3.5 max-w-[58ch] leading-relaxed text-muted-foreground">
                            I hold a B.Tech in Computer Science from{" "}
                            <strong className="font-medium text-foreground">Srinivas University</strong>,
                            and a Diploma in IT and Cloud Computing from{" "}
                            <strong className="font-medium text-foreground">NTTF</strong>.
                        </p>
                        <p className="mb-3.5 max-w-[58ch] leading-relaxed text-muted-foreground">
                            I cut my teeth as a full-stack web developer intern, building responsive
                            interfaces and then the database layer sitting behind them. That pairing
                            is still how I prefer to work — the part people touch and the part that
                            keeps their data straight are one problem seen from two ends.
                        </p>
                        {/* Closes by naming both halves of "developing and deploying"
                            and tying the second one to the job that actually backs it.
                            The page claimed deployment in the headline and then never
                            mentioned the infrastructure role that makes it true. */}
                        <p className="max-w-[58ch] leading-relaxed text-muted-foreground">
                            These days it runs further at both ends: React Native, so a product
                            does not stop at the edge of a tab, and the infrastructure, storage
                            and cloud work I do at{" "}
                            <strong className="font-medium text-foreground">
                                Seria Applied Research
                            </strong>
                            , so it stays up once it ships.
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
