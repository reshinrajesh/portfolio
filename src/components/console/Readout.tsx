import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

const NAV = [
    { label: "work", href: "#work" },
    { label: "stack", href: "#stack" },
    { label: "about", href: "#about" },
    { label: "contact", href: "#contact" },
];

/**
 * The sticky readout bar.
 *
 * It states where you are and what is true, the way the top strip of an
 * instrument does. Everything in it is fact the site can actually stand
 * behind - the domain, the location, the timezone - so nothing here implies a
 * live feed the site no longer has.
 */
export default function Readout() {
    return (
        <header className="sticky top-0 z-20 border-b border-line-strong bg-panel">
            <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-5 gap-y-2.5 px-4 py-2.5 sm:px-6">
                <Logo />

                <span className="hidden font-mono text-meta uppercase text-line-strong sm:inline" aria-hidden="true">
                    /
                </span>
                <span className="hidden font-mono text-meta uppercase text-muted-foreground sm:inline">
                    Kerala, IN
                </span>

                <span className="hidden font-mono text-meta uppercase text-line-strong md:inline" aria-hidden="true">
                    /
                </span>
                <span className="hidden font-mono text-meta uppercase text-muted-foreground md:inline">
                    UTC+05:30
                </span>

                <nav className="ml-auto flex items-center gap-4 sm:gap-5">
                    {NAV.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            className="font-mono text-meta uppercase text-muted-foreground transition-colors hover:text-primary"
                        >
                            {item.label}
                        </a>
                    ))}
                    <ThemeToggle />
                </nav>
            </div>
        </header>
    );
}
