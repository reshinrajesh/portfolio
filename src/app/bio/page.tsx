import { MoveLeft } from "lucide-react";
import { socials } from "@/lib/socials";
import { propertyUrl } from "@/lib/navigation";
import { bioIntro, profile } from "@/content/profile";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";

// Static: the intro used to be a site_content row that was never filled in,
// so the page rendered its fallback on every request while still paying for a
// database round trip.
export default function BioPage() {
    return (
        <div className="w-full max-w-[460px]">
            <div className="mb-5 flex items-center justify-between">
                <Logo blink />
                <ThemeToggle />
            </div>

            <div className="border border-line-strong bg-panel">
                <div className="border-b border-line-strong bg-raise px-4 py-2.5 font-mono text-label uppercase text-muted-foreground">
                    <span className="text-primary">/links</span> &nbsp; {profile.name}
                </div>

                <div className="px-4 py-4">
                    {/* Two lines rather than one: the role statement is 52
                        characters and the card is 460px at its widest, so joining it
                        to the location with a separator wrapped it awkwardly on a
                        phone - which is where a links page is almost always opened. */}
                    <p className="font-mono text-meta uppercase text-foreground">
                        {profile.role}
                    </p>
                    <p className="mt-1 font-mono text-meta uppercase text-muted-foreground">
                        {profile.location}
                    </p>

                    <p className="mt-3 text-sm text-muted-foreground">{bioIntro}</p>
                </div>

                <div className="border-t border-line">
                    {socials.map((social) => {
                        const Icon = social.icon;

                        return (
                            <a
                                key={social.name}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-3 border-b border-line px-4 py-3 font-mono text-xs transition-colors last:border-b-0 hover:bg-raise"
                            >
                                <Icon
                                    size={15}
                                    aria-hidden="true"
                                    className="shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                                />
                                <span className="w-[72px] shrink-0 text-label uppercase text-muted-foreground">
                                    {social.name}
                                </span>
                                <span className="min-w-0 flex-1 break-words transition-colors group-hover:text-primary">
                                    {social.display}
                                </span>
                                <span className="shrink-0 text-meta text-muted-foreground" aria-hidden="true">
                                    &rarr;
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>

            <a
                href={propertyUrl("www")}
                className="mt-5 inline-flex items-center gap-2 font-mono text-meta uppercase text-muted-foreground transition-colors hover:text-primary"
            >
                <MoveLeft size={13} aria-hidden="true" />
                Back to the site
            </a>
        </div>
    );
}
