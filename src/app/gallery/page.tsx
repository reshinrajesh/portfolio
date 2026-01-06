import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Link from "next/link";
import { supabase } from "@/lib/supabase-server";

export const metadata = {
    title: "Gallery | Reshin Rajesh",
    description: "Capturing moments from my travels and life experiences.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function GalleryPage() {
    const { data: images } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

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

            <div className="container mx-auto px-6 py-32 flex-grow">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Gallery
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                        A collection of moments from my travels and life experiences.
                    </p>
                </div>

                {!images || images.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>No images uploaded yet.</p>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {images.map((image: any) => (
                            <div key={image.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-secondary">
                                <img
                                    src={image.url}
                                    alt={image.name || "Gallery image"}
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
