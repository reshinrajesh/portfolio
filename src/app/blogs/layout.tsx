
import BlogNavbar from "@/components/BlogNavbar";
import Footer from "@/components/Footer";

export const metadata = {
    title: "Blog | Res.",
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
