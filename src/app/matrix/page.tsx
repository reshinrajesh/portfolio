import MatrixRain from "@/components/MatrixRain";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MatrixPage() {
    return (
        <main className="relative w-full h-screen bg-black overflow-hidden">
            {/* MatrixRain has z-[9999], so we need z-[10000] for the button */}
            <div className="fixed top-6 left-6 z-[10000]">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors font-mono text-lg bg-black/50 px-4 py-2 rounded border border-green-500/30 backdrop-blur-sm"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>EXIT MATRIX</span>
                </Link>
            </div>

            <MatrixRain />
        </main>
    );
}
