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
            school: "Srinivas University",
            degree: "Bachelor of Technology in Computer Science",
            start: "2021",
            end: "2024",
        },
        {
            school: "Nettur Technical Training Foundation",
            degree: "Diploma in Cloud Computing",
            start: "2018",
            end: "2021",
        },
    ],
    work: [
        {
            company: "Seria Applied Research Pvt. Ltd.",
            link: "",
            badges: [],
            title: "Associate Professional Services Engineer",
            start: "May 2024",
            end: "Present",
            description:
                "Specializing in IT infrastructure management, storage administration, and cloud solutions. Providing professional support to help businesses scale efficiently with secure tech solutions.",
        },
        {
            company: "The Print",
            link: "",
            badges: [],
            title: "Web Developer and Social Media Manager",
            start: "June 2024",
            end: "December 2024",
            description: "Creating websites and managing social media platforms for various clients.",
        },
        {
            company: "Vitvara Technologies",
            link: "",
            badges: ["Intern"],
            title: "Full Stack Web Developer Intern",
            start: "Jul 2023",
            end: "Aug 2023",
            description:
                "Implemented responsive design principles to create a seamless user experience across various devices. Contributed to the development of database structures and integration with web applications.",
        },
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
