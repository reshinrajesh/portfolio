import Logo from "./Logo";
import Link from "next/link";
import { Lock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-8 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <Logo />
                </div>
                <p>&copy; {new Date().getFullYear()} Reshin Rajesh. All rights reserved.</p>
                <div className="mt-4 flex items-center justify-center gap-4">
                    <Link href="/admin/login" className="opacity-50 hover:opacity-100 transition-opacity" aria-label="Admin Login">
                        <Lock size={14} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
