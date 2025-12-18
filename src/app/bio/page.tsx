import { socials } from "@/lib/socials";
import Link from "next/link";
import Image from "next/image";

export default function BioPage() {
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-8">
            {/* Profile Section */}
            <div className="text-center">
                {/* 
                   Ideally, we would use a real profile image here. 
                   Using a solid color div as placeholder matching current site style. 
                   The user can replace this div with:
                   <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary/20">
                     <Image src="/profile.jpg" alt="Profile" fill className="object-cover" />
                   </div>
                 */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary/20">
                    R
                </div>
                <h1 className="text-2xl font-bold mb-2">Reshin Rajesh</h1>
                <p className="text-muted-foreground text-sm">Full Stack Developer | CS Graduate</p>
            </div>

            {/* Links Section */}
            <div className="w-full flex flex-col gap-4">
                {socials.map((social) => {
                    const Icon = social.icon;
                    return (
                        <Link
                            key={social.name}
                            href={social.link}
                            target="_blank"
                            className="flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-full bg-background/50 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Icon size={20} />
                                </div>
                                <span className="font-medium group-hover:text-primary transition-colors">{social.name}</span>
                            </div>
                        </Link>
                    )
                })}
                <Link
                    href="https://reshinrajesh.in"
                    className="flex items-center justify-center p-4 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity mt-4"
                >
                    Visit Portfolio Website
                </Link>
                <Link
                    href="https://blogs.reshinrajesh.in"
                    className="flex items-center justify-center p-4 rounded-xl bg-card border border-border hover:border-purple-500/50 hover:text-purple-500 font-medium transition-all group"
                >
                    Read my Thoughts
                </Link>
            </div>

            <footer className="text-xs text-muted-foreground mt-8">
                © {new Date().getFullYear()} Reshin K Rajesh
            </footer>
        </div>
    );
}
