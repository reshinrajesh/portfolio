import { supabase } from "@/lib/supabase";

/**
 * A row of resume_work exactly as Postgres stores it.
 *
 * `link` and `badges` are frequently empty rather than null - the admin writes
 * "" and [] rather than omitting them - so callers must treat an empty string
 * as absent, not as a URL.
 */
export interface WorkRole {
    id: string;
    company: string;
    title: string;
    start_date: string | null;
    end_date: string | null;
    description: string | null;
    badges: string[] | null;
    link: string | null;
    order: number | null;
}

/** True when the role has no end, i.e. it is the one held now. */
export function isCurrent(role: WorkRole): boolean {
    return (role.end_date ?? "").trim().toLowerCase() === "present";
}

/** The dates as one readable span. Falls back gracefully when either is blank. */
export function tenure(role: WorkRole): string {
    const start = (role.start_date ?? "").trim();
    const end = (role.end_date ?? "").trim();

    if (start && end) {
        return `${start} — ${end}`;
    }

    return start || end || "";
}

/**
 * Selects * rather than naming columns: the table has picked up fields over
 * time (huly_id, badges) and naming a column that does not exist makes
 * PostgREST reject the whole query instead of omitting the field.
 */
export async function getWork(): Promise<WorkRole[]> {
    const { data } = await supabase
        .from("resume_work")
        .select("*")
        .order("order", { ascending: true });

    return ((data as WorkRole[] | null) ?? []).filter((role) => role.title && role.company);
}
