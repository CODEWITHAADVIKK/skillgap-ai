export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Roadmap — SkillGap AI",
  description: "Track your personalized learning roadmap designed by AI to close your skill gaps.",
};

import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { getRoadmapData } from "@/lib/data/dashboard";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  targetDate: Date | null;
  progress: number;
  learningTopics: string[];
  projects: string[];
  estimatedHours: number | null;
  githubRepo: string | null;
}

const STATUS_CONFIG = {
  completed: {
    ring: "border-primary bg-primary",
    text: "text-white",
    card: "border-primary/20 bg-primary/5",
    badge: "bg-primary text-white",
  },
  "in-progress": {
    ring: "border-tertiary bg-tertiary",
    text: "text-white",
    card: "border-tertiary/20 bg-tertiary/5",
    badge: "bg-tertiary text-on-tertiary",
  },
  pending: {
    ring: "border-outline-variant/40 bg-surface-container-high",
    text: "text-on-surface-variant",
    card: "border-outline-variant/20 bg-white",
    badge: "bg-surface-container-high text-on-surface-variant",
  },
} as const;

const DEMO_MILESTONES = [
  {
    id: "1",
    title: "Docker & Container Fundamentals",
    description: "Learn containerization, build Docker images, and run multi-container apps with Docker Compose.",
    status: "completed",
    type: "skill",
    targetDate: new Date("2024-02-15"),
    progress: 100,
    learningTopics: ["Docker basics", "Dockerfile", "Docker Compose", "Networking"],
    projects: ["Containerize a Node.js app", "Multi-service app with Docker Compose"],
    estimatedHours: 25,
    githubRepo: null,
  },
  {
    id: "2",
    title: "AWS Cloud Architecture",
    description: "Master EC2, S3, Lambda, RDS, and IAM. Deploy a full-stack app to AWS.",
    status: "in-progress",
    type: "project",
    targetDate: new Date("2024-03-10"),
    progress: 60,
    learningTopics: ["EC2 & VPC", "S3 & CloudFront", "Lambda", "RDS", "IAM & Security"],
    projects: ["Deploy app to EC2", "Serverless API with Lambda", "S3 media pipeline"],
    estimatedHours: 40,
    githubRepo: null,
  },
  {
    id: "3",
    title: "Redis & Caching Strategies",
    description: "Implement caching, sessions, pub/sub, and real-time features with Redis.",
    status: "pending",
    type: "skill",
    targetDate: new Date("2024-03-25"),
    progress: 0,
    learningTopics: ["Redis data types", "Caching patterns", "Pub/Sub", "Sessions"],
    projects: ["Real-time chat with Redis Pub/Sub", "API rate limiter"],
    estimatedHours: 20,
    githubRepo: null,
  },
  {
    id: "4",
    title: "Kubernetes Orchestration",
    description: "Deploy and manage containerized applications at scale using Kubernetes.",
    status: "pending",
    type: "project",
    targetDate: new Date("2024-04-15"),
    progress: 0,
    learningTopics: ["Pods & Deployments", "Services & Ingress", "Helm Charts", "CI/CD"],
    projects: ["Deploy microservices to K8s", "Set up monitoring with Prometheus"],
    estimatedHours: 35,
    githubRepo: null,
  },
];

export default async function RoadmapPage() {
  const data = await getRoadmapData();

  const milestones: Milestone[] = (data?.milestones?.length ? data.milestones : DEMO_MILESTONES) as Milestone[];
  const title = data?.title ?? "Senior Full Stack Engineer Roadmap";
  const fromRole = data?.fromRole ?? "Mid-Level Developer";
  const toRole = data?.toRole ?? "Senior Full Stack Engineer";
  const weeklyGoal = data?.weeklyGoal ?? 5;
  const weeklyProgress = data?.weeklyProgress ?? 3;

  const completedCount = milestones.filter((m) => m.status === "completed").length;
  const progressPercent = Math.round((completedCount / milestones.length) * 100);
  const weeklyPercent = Math.round((weeklyProgress / weeklyGoal) * 100);

  return (
    <>
      <DashboardHeader
        title="Learning Roadmap"
        subtitle={`Your AI-generated path from ${fromRole} to ${toRole}.`}
      />

      {/* ── Progress Header ───────────────────────────────────────── */}
      <div className="rounded-[28px] bg-white p-8 shadow-sm border border-outline-variant/10 mb-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <h2 className="font-bold text-headline-md mb-1">{title}</h2>
            <p className="text-[12px] text-on-surface-variant">
              {fromRole} → {toRole}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">Overall Progress</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="font-bold text-primary text-label-md shrink-0">{progressPercent}%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1">
              {completedCount} of {milestones.length} milestones completed
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">This Week</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-tertiary to-tertiary/80 rounded-full transition-all"
                  style={{ width: `${Math.min(weeklyPercent, 100)}%` }}
                />
              </div>
              <span className="font-bold text-tertiary text-label-md shrink-0">{weeklyPercent}%</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1">
              {weeklyProgress}h / {weeklyGoal}h goal
            </p>
          </div>
        </div>
      </div>

      {/* ── Milestone Timeline ────────────────────────────────────── */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-outline-variant/20 hidden md:block" />

        <div className="space-y-6">
          {milestones.map((milestone: Milestone, index: number) => {
            const cfg = STATUS_CONFIG[milestone.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.pending;

            return (
              <div key={milestone.id} className="flex gap-6">
                {/* Timeline dot */}
                <div className="relative hidden md:flex shrink-0 flex-col items-center">
                  <div className={`size-14 rounded-full border-4 ${cfg.ring} flex items-center justify-center z-10`}>
                    <span className={`font-bold text-label-md ${cfg.text}`}>{index + 1}</span>
                  </div>
                </div>

                {/* Card */}
                <div className={`flex-1 rounded-[24px] border p-6 shadow-sm transition-shadow hover:shadow-md ${cfg.card}`}>
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                          {milestone.status === "in-progress" ? "In Progress" : milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant px-2.5 py-1 rounded-full bg-surface-container-high">
                          {milestone.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-headline-md">{milestone.title}</h4>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold">Est. Time</p>
                      <p className="font-bold text-label-md">{milestone.estimatedHours}h</p>
                    </div>
                  </div>

                  <p className="text-[13px] text-on-surface-variant mb-4">{milestone.description}</p>

                  {/* Progress bar for in-progress */}
                  {milestone.status === "in-progress" && milestone.progress > 0 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-bold text-on-surface-variant">Progress</span>
                        <span className="font-bold text-tertiary">{milestone.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className="h-full bg-tertiary rounded-full transition-all"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Learning Topics */}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">Learning Topics</p>
                      <div className="flex flex-wrap gap-1.5">
                        {milestone.learningTopics.map((topic: string) => (
                          <span
                            key={topic}
                            className="text-[11px] px-2 py-0.5 bg-surface-container-high rounded-full text-on-surface-variant"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    <div>
                      <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-2">Build Projects</p>
                      <ul className="space-y-1">
                        {milestone.projects.map((project: string) => (
                          <li key={project} className="flex items-center gap-1.5 text-[12px] text-on-surface-variant">
                            <span className="material-symbols-outlined text-[14px] text-primary">check_circle</span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {milestone.targetDate && (
                    <div className="flex items-center gap-1 mt-4 pt-3 border-t border-outline-variant/10">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">event</span>
                      <span className="text-[11px] text-on-surface-variant">
                        Target:{" "}
                        <span className="font-bold">
                          {new Date(milestone.targetDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────── */}
      <div className="mt-8 rounded-[24px] bg-primary-fixed/30 p-6 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-label-md text-primary">🎯 Milestone completed?</p>
          <p className="text-[13px] text-on-surface-variant mt-1">
            Update your progress and let the AI generate your next personalized roadmap milestone.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link
            href="/projects"
            className="px-5 py-2.5 rounded-full border border-primary/30 text-primary font-label-sm text-label-sm hover:bg-primary/5 transition-colors"
          >
            View Projects
          </Link>
          <Link
            href="/gap-analysis"
            className="px-5 py-2.5 rounded-full bg-primary text-white font-label-sm text-label-sm hover:opacity-90 transition-opacity"
          >
            Check Skill Gaps
          </Link>
        </div>
      </div>
    </>
  );
}
