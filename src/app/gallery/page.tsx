import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import { Construction } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "Gallery | Reshin Rajesh",
    description: "Capturing moments from my travels and life experiences.",
};

export default function GalleryPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col relative">
            {/* Minimal Header */}
            <div className="absolute top-0 left-0 p-6 z-50">
                <Logo />
            </div>

            <div className="absolute top-0 right-0 p-6 z-50">
                <Link href="https://reshinrajesh.in" className="text-sm font-medium hover:text-primary transition-colors">
                    &larr; Back to Main Site
                </Link>
            </div>


            <div className="container mx-auto px-6 py-32 flex-grow flex flex-col items-center justify-center text-center">
                <div className="p-4 rounded-full bg-secondary mb-6">
                    <Construction size={48} className="text-orange-500" />
                </div>

                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    Gallery <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Coming Soon</span>
                </h1>

                <p className="text-lg text-muted-foreground max-w-lg mb-8">
                    I'm currently curating the best shots from my travels and adventures.
                    Check back soon for the visual stories!
                </p>

                <div className="flex gap-4">
                    <Link href="https://reshinrajesh.in">
                        <button className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity">
                            Back Home
                        </button>
                    </Link>
                </div>
            </div>

            <Footer />
        </main>
    );
}
