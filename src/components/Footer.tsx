export default function Footer() {
    return (
        <footer className="py-8 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                <p>&copy; {new Date().getFullYear()} Reshin K Rajesh. All rights reserved.</p>
                <p className="mt-2 flex items-center justify-center gap-4">
                    {/* Add social links here if needed */}
                </p>
            </div>
        </footer>
    );
}
