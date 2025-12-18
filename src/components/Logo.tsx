import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    asLink?: boolean;
}

export default function Logo({ className, asLink = true }: LogoProps) {
    const content = (
        <span className={cn("text-2xl font-bold tracking-tighter hover:text-primary transition-colors", className)}>
            Reshin<span className="text-primary">.</span>
        </span>
    );

    if (asLink) {
        return (
            <Link href="/" className="inline-block">
                {content}
            </Link>
        );
    }

    return <div className="inline-block">{content}</div>;
}
