import Logo from "./Logo";

export default function Footer() {
    return (
        <footer className="py-8 bg-background border-t border-border mt-auto">
            <div className="container mx-auto px-6 text-center text-muted-foreground text-sm">
                <div className="flex flex-col items-center gap-4 mb-4">
                    <Logo />
                </div>
                <p>&copy; {new Date().getFullYear()} Reshin Rajesh. All rights reserved.</p>
            </div>
        </footer>
    );
}
