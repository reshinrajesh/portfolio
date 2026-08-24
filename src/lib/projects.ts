import { supabase } from "@/lib/supabase";

/**
 * Shape of a row in the `projects` table.
 *
 * Everything below `description` is case-study material added by
 * scripts/add-project-case-study-fields.sql. All of it is nullable, and the
 * detail page renders only the parts that are filled in — so a project with
 * nothing but a title and a description still produces a coherent page, and
 * the site keeps working before the migration is run.
 */
export interface Project {
    id: string;
    slug: string;
    title: string;
    description: string;
    tags: string[] | null;
    image: string | null;
    demoLink: string | null;
    repoLink: string | null;
    order: number | null;

    summary?: string | null;
    role?: string | null;
    year?: string | null;
    status?: string | null;
    problem?: string | null;
    approach?: string | null;
    outcome?: string | null;
    highlights?: string[] | null;
    content?: string | null;
    gallery?: string[] | null;
}

/** True when the row carries enough to render as a case study rather than a card. */
export function hasCaseStudy(project: Project): boolean {
    return Boolean(
        project.problem ||
        project.approach ||
        project.outcome ||
        project.content ||
        project.highlights?.length,
    );
}

/**
 * Selects * rather than naming columns on purpose: the case-study columns may
 * not exist yet, and naming a missing column makes PostgREST reject the whole
 * query instead of omitting the field.
 */
export async function getProjects(): Promise<Project[]> {
    const { data } = await supabase
        .from("projects")
        .select("*")
        .order("order", { ascending: true });

    return (data as Project[] | null) ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
    const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

    return (data as Project | null) ?? null;
}

export interface AdjacentProjects {
    previous: Project | null;
    next: Project | null;
}

/** Neighbours in display order, so a case study is never a dead end. */
export async function getAdjacentProjects(slug: string): Promise<AdjacentProjects> {
    const projects = await getProjects();
    const index = projects.findIndex((project) => project.slug === slug);

    if (index === -1) {
        return { previous: null, next: null };
    }

    return {
        previous: projects[index - 1] ?? null,
        next: projects[index + 1] ?? null,
    };
}

/** Splits a plain-text field into paragraphs on blank lines. */
export function paragraphs(text: string | null | undefined): string[] {
    if (!text) {
        return [];
    }

    return text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);
}
