/**
 * The project list.
 *
 * This used to be a Supabase table read at request time. With two entries and
 * no editor to serve, a typed array is the whole feature: it is versioned,
 * reviewable in a diff, and it cannot be rewritten by anyone holding a public
 * API key. Adding a project means editing this file.
 */
export interface Project {
    slug: string;
    title: string;
    description: string;
    tags: string[];
    /** Path under public/. */
    image: string | null;
    /** Null when there is nothing to open - rendered as "Not deployed". */
    demoLink: string | null;
    /** Null when the repository is private - rendered as "Not public". */
    repoLink: string | null;
    year: string | null;
}

export const projects: Project[] = [
    {
        slug: "night-guard-womens-safety-robot",
        title: "Night Guard - Womens Safety Robot",
        description: "A surveillance robot designed for women's safety in public places. Detects obstacles and unknown incidents, sending location and video footage to a nearby police station. Built with Arduino IDE.",
        tags: ["Arduino","IoT","C++","Sensors"],
        image: "/robot-project.png",
        demoLink: null,
        repoLink: null,
        year: null,
    },
    {
        slug: "exam-conducting-application",
        title: "Exam Conducting Application",
        description: "A comprehensive web application for conducting exams. Features user management for trainees/instructors and database creation. Built with Django and PostgreSQL.",
        tags: ["Django","PostgreSQL","Python","HTML/CSS"],
        image: "/exam-project.png",
        demoLink: null,
        repoLink: null,
        year: null,
    },
];
