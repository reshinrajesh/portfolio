import { cn } from "@/lib/utils";

interface SectionHeadProps {
    /** The path-style label, e.g. "/work". Carries the accent. */
    address: string;
    /** What the section actually is, in words. */
    name: string;
    /** Optional right-hand readout, e.g. a record count. */
    meta?: string;
    className?: string;
}

/**
 * One header shape for every section: an address, a name, a rule that runs to
 * the edge, and an optional readout. The rule is what makes a page of panels
 * read as one instrument rather than a stack of cards.
 */
export default function SectionHead({ address, name, meta, className }: SectionHeadProps) {
    return (
        <h2
            className={cn(
                "flex items-center gap-3 font-mono text-label uppercase text-muted-foreground mb-5 sm:mb-7",
                className,
            )}
        >
            <span className="text-muted-foreground">{address}</span>
            <span className="text-foreground">{name}</span>
            <span className="rule-fill" aria-hidden="true" />
            {meta ? <span className="hidden sm:inline">{meta}</span> : null}
        </h2>
    );
}
