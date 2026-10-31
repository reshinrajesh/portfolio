import { socials } from "@/lib/socials";
import { propertyUrl } from "@/lib/navigation";
import SectionHead from "./SectionHead";
import CopyEmail from "./CopyEmail";

const EMAIL = "connect@reshinrajesh.in";

export default function Contact() {
    // The email gets its own row with a copy control, so it is excluded here.
    const links = socials.filter((social) => social.name !== "Email");

    return (
        <section id="contact" className="border-t border-line-strong">
            <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16">
                <SectionHead address="/contact" name="Endpoints" />

                <div className="border border-line-strong bg-panel">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5 border-b border-line px-4 py-3 font-mono text-xs">
                        <span className="w-[84px] shrink-0 text-label uppercase text-muted-foreground">
                            Email
                        </span>
                        <a
                            id="contact-email"
                            href={`mailto:${EMAIL}`}
                            className="min-w-0 flex-1 break-words transition-colors hover:text-primary"
                        >
                            {EMAIL}
                        </a>
                        <CopyEmail email={EMAIL} />
                    </div>

                    {links.map((social) => (
                        <a
                            key={social.name}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-3 font-mono text-xs transition-colors last:border-b-0 hover:bg-raise"
                        >
                            <span className="w-[84px] shrink-0 text-label uppercase text-muted-foreground">
                                {social.name}
                            </span>
                            <span className="min-w-0 flex-1 break-words transition-colors group-hover:text-primary">
                                {social.display}
                            </span>
                            <span className="shrink-0 text-meta text-muted-foreground" aria-hidden="true">
                                &rarr;
                            </span>
                        </a>
                    ))}

                    <a
                        href={propertyUrl("bio")}
                        className="group flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 font-mono text-xs transition-colors hover:bg-raise"
                    >
                        <span className="w-[84px] shrink-0 text-label uppercase text-muted-foreground">
                            All links
                        </span>
                        <span className="min-w-0 flex-1 break-words transition-colors group-hover:text-primary">
                            bio.reshinrajesh.in
                        </span>
                        <span className="shrink-0 text-meta text-muted-foreground" aria-hidden="true">
                            &rarr;
                        </span>
                    </a>
                </div>

                <p className="mt-8 max-w-[30ch] font-mono text-title text-balance">
                    Got something that needs building?{" "}
                    <span className="text-primary">Send it over.</span>
                </p>
            </div>
        </section>
    );
}
