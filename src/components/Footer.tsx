import Logo from "./Logo";
import Link from "next/link";
import { } from "lucide-react";
export default function Footer() {
    return (
        <footer className="py-8 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} Reshin Rajesh. All rights reserved.
                    </p>
                    <div className="flex items-center justify-center md:justify-start gap-4 text-xs">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <span className="text-border">•</span>
                        <Link href="https://status.reshinrajesh.in" className="hover:text-primary transition-colors flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Status
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
