import Logo from "./Logo";
import Link from "next/link";
import { } from "lucide-react";
import SpotifyWidget from "./SpotifyWidget";

export default function Footer() {
    return (
        <footer className="py-8 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} Reshin Rajesh. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <SpotifyWidget />
                    </div>
                </div>
            </div>
        </footer>
    );
}
