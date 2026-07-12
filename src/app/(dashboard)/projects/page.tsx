import { getProjectsData } from "@/lib/data/dashboard";
import ProjectsPageClient from "./projects-client";

export default async function ProjectsPage() {
  const projects = await getProjectsData();
  return <ProjectsPageClient projects={projects} />;
}
