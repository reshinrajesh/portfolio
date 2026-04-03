export interface Project {
    title: string;
    description: string;
    tags: string[];
    image: string;
    demoLink: string;
    repoLink: string;
    slug: string;
}

export const projects: Project[] = [
    {
        title: "Night Guard - Womens Safety Robot",
        description:
            "A surveillance robot designed for women's safety in public places. Detects obstacles and unknown incidents, sending location and video footage to a nearby police station. Built with Arduino IDE.",
        tags: ["Arduino", "IoT", "C++", "Sensors"],
        image: "/robot-project.png",
        demoLink: "",
        repoLink: "",
        slug: "night-guard-womens-safety-robot",
    },
    {
        title: "Exam Conducting Application",
        description:
            "A comprehensive web application for conducting exams. Features user management for trainees/instructors and database creation. Built with Django and PostgreSQL.",
        tags: ["Django", "PostgreSQL", "Python", "HTML/CSS"],
        image: "/exam-project.png",
        demoLink: "",
        repoLink: "",
        slug: "exam-conducting-application",
    },
];
