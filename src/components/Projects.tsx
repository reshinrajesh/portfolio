import { supabase } from "@/lib/supabase";
import ProjectsClient from "./ProjectsClient";

export default async function Projects() {
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('order', { ascending: true });

    return <ProjectsClient projects={projects || []} />;
}
