/**
 * Work history, most recent first.
 *
 * `end` is the string "Present" for the role held now. That is what marks it
 * current - position in this array is editorial and must not be load-bearing.
 */
export interface Role {
    company: string;
    title: string;
    start: string;
    end: string;
    description: string;
    badges: string[];
    /** Null when the company has no link worth following. */
    link: string | null;
}

export const roles: Role[] = [
    {
        company: "Seria Applied Research Pvt. Ltd.",
        title: "Associate Professional Services Engineer",
        start: "May 2024",
        end: "Present",
        description: "Specializing in IT infrastructure management, storage administration, and cloud solutions. Providing professional support to help businesses scale efficiently with secure tech solutions.",
        badges: [],
        link: null,
    },
    {
        company: "The Print",
        title: "Web Developer and Social Media Manager",
        start: "June 2024",
        end: "December 2024",
        description: "Creating websites and managing social media platforms for various clients.",
        badges: [],
        link: null,
    },
    {
        company: "Vitvara Technologies",
        title: "Full Stack Web Developer Intern",
        start: "Jul 2023",
        end: "Aug 2023",
        description: "Implemented responsive design principles to create a seamless user experience across various devices. Contributed to the development of database structures and integration with web applications.",
        badges: ["Intern"],
        link: null,
    },
];

/** True when the role has no end date, i.e. the one held now. */
export function isCurrent(role: Role): boolean {
    return role.end.trim().toLowerCase() === "present";
}

/** The dates as one readable span. */
export function tenure(role: Role): string {
    const start = role.start.trim();
    const end = role.end.trim();

    if (start && end) {
        return `${start} — ${end}`;
    }

    return start || end || "";
}
