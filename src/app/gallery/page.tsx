import Footer from "@/components/Footer";
import Logo from "@/components/Logo";
import Link from "next/link";
import { supabase } from "@/lib/supabase-server";
import { Folder } from "lucide-react";

export const metadata = {
    title: "Gallery | Reshin Rajesh",
    description: "Capturing moments from my travels and life experiences.",
};

// Revalidate every hour
export const revalidate = 3600;

export default async function GalleryPage({
    searchParams,
}: {
    searchParams: Promise<{ album: string }>
}) {
    // Await searchParams as per Next.js 15+ requirements if applicable, or safe to just await
    const params = await searchParams;
    const albumId = params.album;

    // Fetch albums and images in parallel
    const [albumsRes, imagesRes] = await Promise.all([
        supabase.from('albums').select('*').order('created_at', { ascending: false }),
        (async () => {
            let query = supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
            if (albumId) {
                query = query.eq('album_id', albumId);
            }
            return query;
        })()
    ]);

    const albums = albumsRes.data || [];
    const images = imagesRes.data || [];

    // Get active album title if filtering
    const activeAlbum = albums.find((a: any) => a.id === albumId);

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
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                        Gallery
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-lg mx-auto">
                        A collection of moments from my travels and life experiences.
                    </p>
                </div>

                {/* Albums Sections */}
                {albums.length > 0 && (
                    <div className="mb-12 overflow-x-auto pb-4">
                        <div className="flex justify-center gap-4 min-w-max px-4">
                            <Link
                                href="/gallery"
                                className={`px-5 py-2 rounded-full border transition-all flex items-center gap-2 whitespace-nowrap
                                    ${!albumId
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : 'bg-secondary text-foreground border-transparent hover:border-primary/50'}`}
                            >
                                All Photos
                            </Link>
                            {albums.map((album: any) => (
                                <Link
                                    key={album.id}
                                    href={`/gallery?album=${album.id}`}
                                    className={`px-5 py-2 rounded-full border transition-all flex items-center gap-2 whitespace-nowrap
                                        ${albumId === album.id
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-secondary text-foreground border-transparent hover:border-primary/50'}`}
                                >
                                    {albumId === album.id && <Folder size={14} fill="currentColor" />}
                                    {album.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {!images || images.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p>{albumId ? `No images in ${activeAlbum?.title || 'this album'} yet.` : 'No images uploaded yet.'}</p>
                        {albumId && (
                            <Link href="/gallery" className="text-primary hover:underline mt-2 inline-block">
                                View all photos
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {images.map((image: any) => (
                            <div key={image.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-secondary">
                                <img
                                    src={image.url}
                                    alt={image.name || "Gallery image"}
                                    className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <div className="absolute bottom-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {/* Optional: Show album name tag on hover if viewing all */}
                                    {!albumId && image.album_id && (
                                        <span className="text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-md">
                                            {albums.find((a: any) => a.id === image.album_id)?.title}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
