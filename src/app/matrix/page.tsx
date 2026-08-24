import MatrixRain from "@/components/MatrixRain";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MatrixPage() {
    return (
        <main className="relative w-full h-screen bg-console overflow-hidden">
            {/* MatrixRain has z-[9999], so we need z-[10000] for the button */}
            <div className="fixed top-6 left-6 z-[10000]">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-console-ok hover:text-console-ok transition-colors font-mono text-lg bg-console/50 px-4 py-2 rounded border border-console-ok/30 backdrop-blur-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>EXIT MATRIX</span>
                </Link>
            </div>

            <MatrixRain />
        </main>
    );
}
