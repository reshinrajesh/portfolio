export const metadata = {
    title: "Links",
    description: "Every way to reach Reshin Rajesh, in one place.",
};

export default function BioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10 text-foreground">
            {children}
        </main>
    );
}
