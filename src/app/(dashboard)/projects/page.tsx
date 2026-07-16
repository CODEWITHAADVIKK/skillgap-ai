export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — SkillGap AI",
  description: "Suggested projects to build that will showcase your skills and close gaps.",
};

import { getProjectsData } from "@/lib/data/dashboard";
import ProjectsPageClient from "./projects-client";

export default async function ProjectsPage() {
  const projects = await getProjectsData();
  return <ProjectsPageClient projects={projects} />;
}
