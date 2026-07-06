import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard/header";
import { getGapAnalysisData } from "@/lib/data/dashboard";
import { SkillRadarChart } from "@/components/dashboard/skill-radar-chart";

interface Gap {
  id: string;
  skill: string;
  priority: string;
  marketImportance: number;
  confidenceScore: number;
  whyItMatters: string;
  companies: string[];
  difficulty: string;
  estimatedHours: number;
  learningResources: unknown;
  suggestedProjects: unknown;
}

const PRIORITY_CONFIG = {
  critical: { color: "text-error", bg: "bg-error/10", border: "border-error/20", dot: "bg-error" },
  high: { color: "text-tertiary", bg: "bg-tertiary/10", border: "border-tertiary/20", dot: "bg-tertiary" },
  medium: { color: "text-primary", bg: "bg-primary/10", border: "border-primary/20", dot: "bg-primary" },
  low: { color: "text-on-surface-variant", bg: "bg-surface-container-high", border: "border-outline-variant/20", dot: "bg-on-surface-variant" },
} as const;

const DEMO_GAPS = [
  {
    id: "1",
    skill: "Docker",
    priority: "critical",
    marketImportance: 92,
    confidenceScore: 88,
    whyItMatters: "Docker is required in 78% of Full Stack Engineer job postings for containerized deployments.",
    companies: ["Stripe", "Google", "Amazon"],
    difficulty: "intermediate",
    estimatedHours: 30,
    learningResources: null,
    suggestedProjects: null,
  },
  {
    id: "2",
    skill: "Redis",
    priority: "high",
    marketImportance: 85,
    confidenceScore: 82,
    whyItMatters: "Redis is essential for caching, session management, and real-time features in modern backends.",
    companies: ["Netflix", "Uber", "Twitter"],
    difficulty: "intermediate",
    estimatedHours: 25,
    learningResources: null,
    suggestedProjects: null,
  },
  {
    id: "3",
    skill: "AWS",
    priority: "high",
    marketImportance: 90,
    confidenceScore: 85,
    whyItMatters: "Cloud infrastructure skills are mandatory for modern engineering roles at scale.",
    companies: ["Amazon", "Microsoft", "Salesforce"],
    difficulty: "advanced",
    estimatedHours: 40,
    learningResources: null,
    suggestedProjects: null,
  },
  {
    id: "4",
    skill: "Kubernetes",
    priority: "medium",
    marketImportance: 75,
    confidenceScore: 78,
    whyItMatters: "Container orchestration is increasingly required for senior engineering roles.",
    companies: ["Google", "Spotify", "Adobe"],
    difficulty: "advanced",
    estimatedHours: 35,
    learningResources: null,
    suggestedProjects: null,
  },
];

export default async function GapAnalysisPage() {
  const data = await getGapAnalysisData();

  const dreamRole = data?.dreamRole ?? "Full Stack Engineer";
  const currentSkills = data?.currentSkills?.length
    ? data.currentSkills
    : ["React", "TypeScript", "Tailwind CSS", "Node.js", "JavaScript"];
  const gaps: Gap[] = (data?.gaps?.length ? data.gaps : DEMO_GAPS) as Gap[];
  const scores = data?.scores ?? { careerReadiness: 72, skillGap: 68 };

  const criticalCount = gaps.filter((g: Gap) => g.priority === "critical").length;
  const highCount = gaps.filter((g: Gap) => g.priority === "high").length;


  return (
    <>
      <DashboardHeader
        title="Skill Gap Analysis"
        subtitle={`Comparing your profile against ${dreamRole} market requirements from live job postings.`}
      />

      {/* ── Score Cards ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-8">
        {[
          { label: "Career Readiness", value: `${scores.careerReadiness}`, suffix: "/100", color: "text-primary" },
          { label: "Skill Coverage", value: `${scores.skillGap}`, suffix: "/100", color: "text-tertiary" },
          { label: "Current Skills", value: `${currentSkills.length}`, suffix: "", color: "text-on-surface" },
          { label: "Missing Skills", value: `${gaps.length}`, suffix: "", color: "text-error" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">{stat.label}</p>
            <p className={`text-headline-md font-bold ${stat.color}`}>
              {stat.value}
              <span className="text-on-surface-variant font-normal text-body-md">{stat.suffix}</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Main column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Current Skills */}
          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <h4 className="font-bold text-body-md mb-4">Your Current Skills</h4>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill) => (
                <span
                  key={skill}
                  className="px-4 py-2 bg-primary-fixed/40 text-primary rounded-full text-label-sm font-bold border border-primary/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Priority summary */}
          {(criticalCount > 0 || highCount > 0) && (
            <div className="rounded-[24px] bg-error/5 border border-error/15 p-5 flex items-center gap-4">
              <div className="size-10 rounded-xl bg-error/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-error text-[20px]">warning</span>
              </div>
              <div>
                <p className="font-bold text-label-md text-error">
                  {criticalCount} critical + {highCount} high priority gaps identified
                </p>
                <p className="text-[12px] text-on-surface-variant mt-0.5">
                  Addressing these first will maximize your hiring probability for {dreamRole} roles.
                </p>
              </div>
            </div>
          )}

          {/* Missing Skills Cards */}
          <div className="space-y-4">
            <h4 className="font-bold text-body-md">Missing Skills — Priority Ranked</h4>
            {gaps.map((gap) => {
              const pCfg = PRIORITY_CONFIG[gap.priority as keyof typeof PRIORITY_CONFIG] ?? PRIORITY_CONFIG.low;
              return (
                <div
                  key={gap.id}
                  className={`rounded-[24px] bg-white p-6 shadow-sm border ${pCfg.border} transition-shadow hover:shadow-md`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`size-2.5 rounded-full ${pCfg.dot} shrink-0 mt-1`} />
                      <div>
                        <h5 className="font-bold text-headline-md leading-tight">{gap.skill}</h5>
                        <span className={`text-[11px] capitalize font-bold ${pCfg.color}`}>
                          {gap.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold">Market Demand</p>
                      <p className="font-bold text-primary text-label-md">{gap.marketImportance}%</p>
                    </div>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-sm">
                    {gap.whyItMatters}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${gap.confidenceScore}%` }}
                          />
                        </div>
                        <span className="text-label-sm font-bold">{gap.confidenceScore}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Learning Time</p>
                      <p className="font-bold text-label-md">{gap.estimatedHours}h</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Difficulty</p>
                      <p className="font-bold capitalize text-label-sm">{gap.difficulty}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-bold mb-1">Companies</p>
                      <p className="text-label-sm font-bold">{gap.companies.slice(0, 3).join(", ")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-3 border-t border-outline-variant/10">
                    <Link href="/projects" className="text-primary text-label-sm font-bold hover:underline">
                      Suggested Projects →
                    </Link>
                    <Link href="/roadmap" className="text-primary text-label-sm font-bold hover:underline">
                      Learning Path →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Sidebar ───────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Radar Chart */}
          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <h4 className="font-bold text-body-md mb-1">Skill Radar</h4>
            <p className="text-[12px] text-on-surface-variant mb-4">
              Your skills vs market demand
            </p>
            <SkillRadarChart currentSkills={currentSkills} gaps={gaps} />
            <div className="flex gap-4 mt-3 justify-center">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-primary" />
                <span className="text-[11px] text-on-surface-variant">Market Demand</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-tertiary" />
                <span className="text-[11px] text-on-surface-variant">Your Level</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-[24px] bg-primary-fixed/30 p-6 border border-primary-container/20">
            <p className="text-label-sm text-primary font-bold mb-2">Next Steps</p>
            <p className="text-[13px] text-on-surface-variant mb-4">
              Focus on your top {Math.min(2, criticalCount + highCount)} critical gaps to maximize hiring probability.
            </p>
            <Link href="/roadmap" className="text-primary text-label-sm font-bold hover:underline">
              View Intelligent Roadmap →
            </Link>
          </div>

          {/* Skill Demand Breakdown */}
          <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <h4 className="font-bold text-body-md mb-4">Demand Breakdown</h4>
            <div className="space-y-3">
              {gaps.slice(0, 5).map((gap) => (
                <div key={gap.id}>
                  <div className="flex justify-between text-[12px] mb-1">
                    <span className="font-bold">{gap.skill}</span>
                    <span className="text-primary font-bold">{gap.marketImportance}%</span>
                  </div>
                  <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                      style={{ width: `${gap.marketImportance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
