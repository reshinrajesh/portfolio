import PhotoGrid from "@/components/PhotoGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Gallery | Reshin Rajesh",
    description: "Capturing moments from my travels and life experiences.",
};

export default function GalleryPage() {
    return (
        <main className="bg-background min-h-screen flex flex-col">
            <Navbar />

            <div className="container mx-auto px-6 py-32 flex-grow">
                <header className="mb-16 text-center max-w-2xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                        Capturing <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Moments</span>
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        A visual diary of places, faces, and the spaces in between code.
                    </p>
                </header>

                <PhotoGrid />
            </div>

            <Footer />
        </main>
    );
}
