const SPECS = [
    { k: "Role", v: "Full-stack developer" },
    { k: "Based", v: "Kerala, India" },
    { k: "Primary stack", v: "React Native · Next.js · Node · Postgres" },
    { k: "Contact", v: "connect@reshinrajesh.in" },
];

/**
 * The opener. The prompt line and the block cursor are the mark at full size -
 * the same two ideas the favicon is cut from, so the identity is established
 * before the visitor has read a word.
 *
 * Sized to its content rather than to the viewport: a 100vh hero would push
 * the spec grid out of the first frame, and that grid is the part that
 * answers "who is this" fastest.
 */
export default function Hero() {
    return (
        <section className="mx-auto max-w-[1240px] px-4 pb-8 pt-10 sm:px-6 sm:pb-12 sm:pt-16">
            <p className="animate-rise mb-4 font-mono text-meta text-muted-foreground">
                <span className="text-primary">&gt;</span> whoami
            </p>

            <h1 className="animate-rise delay-1 font-mono text-display uppercase break-words">
                Reshin <span className="text-primary">Rajesh</span>
                <span
                    aria-hidden="true"
                    className="ml-[0.1em] inline-block h-[0.86em] w-[0.46em] align-[-0.06em] bg-primary motion-safe:animate-[blink_1.15s_steps(1,end)_3]"
                />
            </h1>

            <p className="animate-rise delay-1 mt-4 font-mono text-meta uppercase text-muted-foreground">
                Developing and Deploying Mobile and Web Applications
            </p>

            <p className="animate-rise delay-2 mt-7 max-w-[56ch] text-lead text-muted-foreground">
                I build for the web by day and chase concerts and sunsets by night.{" "}
                <strong className="font-medium text-foreground">
                    Half my life happens in a terminal
                </strong>
                , the other half on the road. Computer Science graduate with a Diploma in
                Cloud Computing, shipping React and Next.js at the front and Postgres behind it.
            </p>

            {/* The frame is drawn by two halves: the container owns the top and
                left edges, each cell owns its right and bottom. That completes the
                outer border exactly once however many cells wrap to a second row -
                putting a full border on the container instead doubles every edge
                the last row touches. One colour throughout, for the same reason. */}
            <dl className="animate-rise delay-3 mt-8 grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] border-l border-t border-line-strong bg-panel">
                {SPECS.map((spec) => (
                    <div
                        key={spec.k}
                        className="min-w-0 border-b border-r border-line-strong px-4 py-4"
                    >
                        <dt className="mb-1.5 font-mono text-label uppercase text-muted-foreground">
                            {spec.k}
                        </dt>
                        <dd className="font-mono text-sm break-words">{spec.v}</dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
