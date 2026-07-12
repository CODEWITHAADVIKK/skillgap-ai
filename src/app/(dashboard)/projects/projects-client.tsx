"use client";

import { useTransition } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { updateProjectProgress } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string;
  description: string | null;
  skillsCovered: string[];
  difficulty: string;
  duration: string | null;
  resumeImpact: number | null;
  portfolioValue: number | null;
  progress: number;
  status: string;
}

const DEMO_PROJECTS: Project[] = [
  {
    id: "demo-1",
    title: "Scalable Real-time Chat with Redis",
    description: "Build a production-ready real-time chat application using Redis pub/sub, WebSockets, and Docker for deployment.",
    skillsCovered: ["Redis", "Node.js", "Docker", "WebSockets"],
    difficulty: "intermediate",
    duration: "5 days",
    resumeImpact: 85,
    portfolioValue: 90,
    progress: 15,
    status: "in_progress",
  },
  {
    id: "demo-2",
    title: "Serverless E-commerce API",
    description: "Create a serverless storefront API using AWS Lambda, DynamoDB, and API Gateway with full CI/CD pipeline.",
    skillsCovered: ["AWS Lambda", "DynamoDB", "AWS", "CI/CD"],
    difficulty: "advanced",
    duration: "7 days",
    resumeImpact: 92,
    portfolioValue: 95,
    progress: 0,
    status: "suggested",
  },
  {
    id: "demo-3",
    title: "Containerized Microservices Platform",
    description: "Design and deploy a microservices architecture with Docker Compose and Kubernetes orchestration.",
    skillsCovered: ["Docker", "Kubernetes", "Microservices", "System Design"],
    difficulty: "advanced",
    duration: "10 days",
    resumeImpact: 88,
    portfolioValue: 93,
    progress: 0,
    status: "suggested",
  },
];

function ProjectCard({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  function handleProgress(newProgress: number) {
    if (project.id.startsWith("demo-")) return;
    startTransition(async () => {
      await updateProjectProgress(project.id, newProgress);
    });
  }

  const statusColor =
    project.status === "completed"
      ? "text-primary bg-primary/10"
      : project.status === "in_progress"
      ? "text-tertiary bg-tertiary/10"
      : "text-on-surface-variant bg-surface-container-high";

  const difficultyColor =
    project.difficulty === "advanced"
      ? "text-error bg-error/10"
      : project.difficulty === "intermediate"
      ? "text-tertiary bg-tertiary/10"
      : "text-primary bg-primary/10";

  return (
    <div className="rounded-[28px] bg-white overflow-hidden shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow">
      {/* Color banner */}
      <div className="h-3 bg-gradient-to-r from-primary via-primary/60 to-primary/20" />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4 gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${statusColor}`}>
                {project.status.replace("_", " ")}
              </span>
              <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${difficultyColor}`}>
                {project.difficulty}
              </span>
            </div>
            <h3 className="font-bold text-headline-md leading-snug">{project.title}</h3>
          </div>
          {project.duration && (
            <div className="text-right shrink-0">
              <p className="text-[10px] text-on-surface-variant uppercase font-bold">Duration</p>
              <p className="font-bold text-label-md">{project.duration}</p>
            </div>
          )}
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant mb-5 text-sm">{project.description ?? ""}</p>

        {/* Skills tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {project.skillsCovered.map((skill) => (
            <span key={skill} className="px-3 py-1.5 bg-primary-fixed/40 text-primary rounded-full text-label-sm font-bold border border-primary/10">
              {skill}
            </span>
          ))}
        </div>

        {/* Impact metrics */}
        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="p-3 bg-surface-container-low rounded-2xl">
            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Resume Impact</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${project.resumeImpact ?? 0}%` }} />
              </div>
              <span className="font-bold text-primary text-label-sm shrink-0">{project.resumeImpact ?? "—"}%</span>
            </div>
          </div>
          <div className="p-3 bg-surface-container-low rounded-2xl">
            <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Portfolio Value</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full" style={{ width: `${project.portfolioValue ?? 0}%` }} />
              </div>
              <span className="font-bold text-tertiary text-label-sm shrink-0">{project.portfolioValue ?? "—"}%</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-[12px] mb-1">
            <span className="font-bold text-on-surface-variant">Progress</span>
            <span className="font-bold text-primary">{project.progress}%</span>
          </div>
          <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {project.id.startsWith("demo-") ? (
            <Button className="flex-1 rounded-full">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Start Project
            </Button>
          ) : (
            <>
              <Button
                className="flex-1 rounded-full"
                disabled={isPending}
                onClick={() => handleProgress(Math.min(100, project.progress + 25))}
              >
                {isPending ? "Saving..." : "Update Progress +25%"}
              </Button>
              {project.progress < 100 && (
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={isPending}
                  onClick={() => handleProgress(100)}
                >
                  Mark Complete
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPageClient({ projects }: { projects: Project[] }) {
  const displayProjects = projects.length ? projects : DEMO_PROJECTS;

  return (
    <>
      <DashboardHeader
        title="Personalized Projects"
        subtitle="AI-generated projects designed to close your skill gaps and impress recruiters."
      />
      <div className="space-y-6">
        {displayProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
