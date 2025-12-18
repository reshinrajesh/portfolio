import { getBio } from "@/app/actions";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import { socials } from "@/lib/socials";

export const revalidate = 0;

export default async function BioPage() {
    const bioContent = await getBio();

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8 px-6 py-12">
            {/* Header */}
            <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
                    RR
                </div>
                <h1 className="text-2xl font-bold mb-2">Reshin Rajesh</h1>
                <p className="text-muted-foreground text-sm">Full Stack Developer & Creator</p>
            </div>

            {/* Dynamic Bio Content */}
            <div
                className="w-full text-center text-sm text-muted-foreground prose prose-invert prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: bioContent || '<p>Welcome to my links page!</p>' }}
            />

            {/* Links Grid */}
            <div className="w-full flex flex-col gap-3">
                {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                        <Link
                            key={social.name}
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 rounded-xl bg-secondary/50 border border-border hover:bg-secondary hover:scale-[1.02] transition-all group"
                        >
                            <div className="p-2 bg-background rounded-lg text-primary group-hover:text-foreground transition-colors">
                                <Icon size={20} />
                            </div>
                            <span className="flex-1 text-center font-medium">{social.name}</span>
                            <div className="w-9" />
                        </Link>
                    );
                })}
            </div>

            <Link
                href="https://reshinrajesh.in"
                className="mt-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
                <MoveLeft size={16} />
                Back to Website
            </Link>
        </div>
    );
}
