
import BlogNavbar from "@/components/BlogNavbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Reshin K Rajesh | Blog",
    description: "Read my latest thoughts and articles.",
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <BlogNavbar />
            <main className="min-h-screen bg-background">
                {children}
            </main>
            <Footer />
        </>
    );
}
