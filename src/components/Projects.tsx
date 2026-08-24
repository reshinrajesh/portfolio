import ProjectsClient from "./ProjectsClient";
import { getProjects } from "@/lib/projects";

export default async function Projects() {
    const projects = await getProjects();

    return <ProjectsClient projects={projects} />;
}
