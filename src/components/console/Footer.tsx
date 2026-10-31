import Logo from "@/components/Logo";

export default function Footer({ buildSha }: { buildSha?: string }) {
    return (
        <footer className="border-t border-line-strong bg-panel">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 sm:px-6">
                <div className="flex items-center gap-4">
                    <Logo asLink={false} className="text-base" />
                    <span className="font-mono text-meta uppercase text-muted-foreground">
                        Kerala, India
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-meta uppercase text-muted-foreground">
                    <span>&copy; {new Date().getFullYear()}</span>
                    {/* The deployed commit, when the build exposes it. Useful to me and
                        harmless to everyone else; absent locally, so it is conditional. */}
                    {buildSha ? <span>build {buildSha.slice(0, 7)}</span> : null}
                </div>
            </div>
        </footer>
    );
}
