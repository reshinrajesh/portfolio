import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    /** Wraps the mark in a link home. Off for the footer, where it is a signature. */
    asLink?: boolean;
    /** Animates the block cursor. Reserved for the hero - a blinking logo in
     *  sticky chrome is a distraction on every scroll. */
    blink?: boolean;
    /** Drops the caret and the name, leaving the cursor alone. The icon form. */
    iconOnly?: boolean;
}

/**
 * The Prompt mark.
 *
 * Three parts, in order of how much they can be dropped: a caret that marks it
 * as a prompt, the name in lower case, and a block cursor. The cursor is the
 * mark proper - it is what the favicon shows, and it is the only part drawn as
 * geometry rather than type, so it survives at 16px and exports to SVG without
 * needing a font.
 *
 * Everything inherits currentColor except the caret and cursor, which take the
 * one accent. That means the mark drops onto any surface in either theme
 * without a second cut.
 */
export default function Logo({
    className,
    asLink = true,
    blink = false,
    iconOnly = false,
}: LogoProps) {
    const cursor = (
        <span
            aria-hidden="true"
            className={cn(
                "inline-block w-[0.46em] h-[0.96em] bg-primary align-[-0.08em]",
                blink && "motion-safe:animate-[blink_1.15s_steps(1,end)_3]",
            )}
        />
    );

    const content = iconOnly ? (
        <span className={cn("font-mono text-xl leading-none", className)}>
            <span className="sr-only">Reshin Rajesh</span>
            {cursor}
        </span>
    ) : (
        <span
            className={cn(
                "font-mono font-medium text-xl leading-none tracking-tight inline-flex items-center gap-[0.1em]",
                className,
            )}
        >
            <span className="text-primary" aria-hidden="true">&gt;</span>
            <span>reshin</span>
            {cursor}
            <span className="sr-only">Reshin Rajesh</span>
        </span>
    );

    if (!asLink) {
        return <span className="inline-block">{content}</span>;
    }

    return (
        <Link
            href="/"
            className="inline-block transition-opacity hover:opacity-80"
            aria-label="Reshin Rajesh, home"
        >
            {content}
        </Link>
    );
}
