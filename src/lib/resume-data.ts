import { Github, Linkedin, Mail, Twitter, Globe } from "lucide-react";

export const RESUME_DATA = {
    name: "Reshin Rajesh",
    initials: "RR",
    location: "Kerala, India",
    locationLink: "https://www.google.com/maps/place/Kerala,+India",
    about:
        "Full Stack Developer dedicated to building high-quality, user-centric web applications. Passionate about modern UI/UX, performance optimization, and secure systems.",
    summary:
        "Computer Science graduate with expertise in the Next.js ecosystem. Proven track record in building performant web apps, from interactive 3D portfolios to secure admin dashboards. specific interests in Creative Development and System Architecture.",
    avatarUrl: "https://github.com/reshinrajesh.png",
    personalWebsiteUrl: "https://reshinrajesh.in",
    contact: {
        email: "reshinrajesh@gmail.com", // Placeholder
        tel: "+91 0000000000", // Placeholder
        social: [
            {
                name: "GitHub",
                url: "https://github.com/reshinrajesh",
                icon: Github,
            },
            {
                name: "LinkedIn",
                url: "https://linkedin.com/in/reshinrajesh",
                icon: Linkedin,
            },
            {
                name: "Website",
                url: "https://reshinrajesh.in",
                icon: Globe,
            },
        ],
    },
    education: [
        {
            school: "University Name", // Placeholder
            degree: "Bachelor of Technology in Computer Science",
            start: "2020",
            end: "2024",
        },
    ],
    work: [
        {
            company: "Freelance",
            link: "https://reshinrajesh.in",
            badges: ["Remote"],
            title: "Full Stack Developer",
            start: "2022",
            end: "Present",
            description:
                "Developed and deployed custom web applications using Next.js, React, and Supabase. Implemented complex features like secure authentication, real-time databases, and interactive 3D elements.",
        },
        // Add more experience here
    ],
    skills: [
        "React/Next.js",
        "TypeScript",
        "Tailwind CSS",
        "Node.js",
        "Supabase",
        "PostgreSQL",
        "Framer Motion",
        "Git",
        "System Design",
    ],
    projects: [
        {
            title: "Portfolio 2024",
            techStack: ["Next.js", "TypeScript", "Framer Motion", "Supabase"],
            description:
                "A high-performance personal portfolio featuring secure admin routes, visitor tracking, and interactive 3D components.",
            link: {
                label: "reshinrajesh.in",
                href: "https://reshinrajesh.in",
            },
        },
        {
            title: "Experimental Lab",
            techStack: ["React", "Three.js", "Spotify API"],
            description:
                "A secure testing ground for new web technologies, featuring JWT-based route protection and real-time API integrations.",
            link: {
                label: "demo.reshinrajesh.in",
                href: "https://demo.reshinrajesh.in",
            },
        },
    ],
};
