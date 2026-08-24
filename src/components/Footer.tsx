import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-border bg-background py-8">
            <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
                <div className="mb-4 flex flex-col items-center gap-4">
                    <p className="text-sm leading-loose">
                        &copy; {new Date().getFullYear()} Reshin Rajesh. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs">
                        <Link href="/privacy" className="transition-colors hover:text-primary">
                            Privacy Policy
                        </Link>
                        <span aria-hidden="true" className="text-border">&bull;</span>
                        <Link
                            href="https://status.reshinrajesh.in"
                            className="flex items-center gap-1.5 transition-colors hover:text-primary"
                        >
                            <span aria-hidden="true" className="h-2 w-2 animate-pulse rounded-full bg-success" />
                            System Status
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
