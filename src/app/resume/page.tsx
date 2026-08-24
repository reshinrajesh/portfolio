import ResumeClient from "./ResumeClient";
import { supabase } from "@/lib/supabase";
import { getSkills } from "@/app/admin/skills/actions";

export const metadata = {
    title: "Resume | Reshin Rajesh",
    description: "My professional resume and experience.",
};

export const revalidate = 60; // Revalidate every minute

// Used only when the skills table is empty or unavailable.
const FALLBACK_SKILLS = [
    "React/Next.js", "TypeScript", "Tailwind CSS", "Node.js",
    "Supabase", "PostgreSQL", "Framer Motion", "Git", "System Design",
];

export default async function ResumePage() {
    // Parallel fetching
    const [wRes, eRes, pRes, aRes, sRes, managedSkills] = await Promise.all([
        supabase.from('resume_work').select('*').order('order', { ascending: true }),
        supabase.from('resume_education').select('*').order('order', { ascending: true }),
        supabase.from('projects').select('*').order('order', { ascending: true }),
        supabase.from('site_content').select('value').eq('key', 'about').single(),
        supabase.from('site_content').select('value').eq('key', 'summary').single(),
        getSkills()
    ]);

    const RESUME_DATA = {
        name: "Reshin Rajesh",
        initials: "RR",
        location: "Kerala, India",
        locationLink: "https://www.google.com/maps/place/Kerala,+India",
        about: aRes.data?.value || "",
        summary: sRes.data?.value || "",
        avatarUrl: "https://github.com/reshinrajesh.png",
        personalWebsiteUrl: "https://reshinrajesh.in",
        contact: {
            email: "connect@reshinrajesh.in",
            social: [
                { name: "GitHub", url: "https://github.com/reshinrajesh" },
                { name: "LinkedIn", url: "https://linkedin.com/in/reshinrajesh" },
                { name: "Website", url: "https://reshinrajesh.in" }
            ]
        },
        education: (eRes.data || []).map((e: any) => ({
            school: e.school,
            degree: e.degree,
            start: e.start_date,
            end: e.end_date
        })),
        work: (wRes.data || []).map((w: any) => ({
            company: w.company,
            link: w.link || "",
            badges: w.badges || [],
            title: w.title,
            start: w.start_date,
            end: w.end_date,
            description: w.description
        })),
        // Sourced from the admin Skills manager. This list was previously
        // hardcoded here, so editing skills in the CMS changed nothing.
        skills: (managedSkills ?? []).length > 0
            ? (managedSkills as { name: string }[]).map((skill) => skill.name)
            : FALLBACK_SKILLS,
        projects: (pRes.data || []).map((p: any) => ({
            title: p.title,
            techStack: p.tags || [],
            description: p.description,
            link: { label: "Link", href: p.demoLink || p.repoLink || `/projects/${p.slug}` }
        }))
    };

    return <ResumeClient RESUME_DATA={RESUME_DATA} />;
}
