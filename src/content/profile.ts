/**
 * Everything about the person that is not a project or a job: the identity
 * strings the chrome repeats, the qualifications, and the line the links page
 * opens with.
 *
 * Single source of truth on purpose. These strings were previously duplicated
 * across the hero, the footer, the readout bar, the social card and the SEO
 * description, which is how the site ended up claiming one location in six
 * places and a different one in a seventh.
 */
import { CONTACT_EMAIL } from "@/lib/site";

export const profile = {
    name: "Reshin Rajesh",
    role: "Developing and Deploying Mobile and Web Applications",
    title: "Full-stack developer",
    location: "Bengaluru, India",
    locationShort: "Bengaluru, IN",
    timezone: "UTC+05:30",
    email: CONTACT_EMAIL,
    primaryStack: "React Native · Next.js · Node · Postgres",
} as const;

export interface Qualification {
    kind: string;
    award: string;
    institution: string;
    /** Abbreviation for tight columns; falls back to `institution`. */
    short?: string;
    start: string;
    end: string;
}

export const education: Qualification[] = [
    {
        kind: "Degree",
        award: "B.Tech, Computer Science",
        institution: "Srinivas University",
        start: "2021",
        end: "2024",
    },
    {
        kind: "Diploma",
        award: "IT and Cloud Computing",
        institution: "Nettur Technical Training Foundation",
        short: "NTTF",
        start: "2018",
        end: "2021",
    },
];
