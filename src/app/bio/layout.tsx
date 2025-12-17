export const metadata = {
    title: "Reshin K Rajesh | Links",
    description: "Connect with me on social media and check out my work.",
};

export default function BioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            {children}
        </main>
    );
}
