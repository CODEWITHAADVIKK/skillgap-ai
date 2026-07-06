import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { fetchRemoteOKJobs, generateMarketInsights } from "@/lib/services/job-engine";
import type { ParsedResume } from "@/lib/services/resume-parser";

export interface DashboardData {
  profile: {
    dreamRole: string;
    careerReadinessScore: number;
    skillGapScore: number;
    resumeHealth: number;
    atsScore: number;
    githubHealth: number;
    weeklyGoalHours: number;
    weeklyProgressHours: number;
    onboardingComplete: boolean;
  };
  stats: {
    skillsCount: number;
    gapsCount: number;
    projectsCount: number;
    rank: string;
  };
  missingSkills: { name: string; priority: string }[];
  recommendations: string[];
  skillRadar: { skill: string; score: number }[];
  recentActivity: { action: string; time: string }[];
  jobMatches: { company: string; title: string; match: number }[];
  marketTrends: { skill: string; demand: number }[];
  // Enhanced dashboard fields
  firstName?: string;
  streak?: number;
  heroMessage?: string;
  todayGoal?: string;
  atsMissingKeywords?: string;
  activeRepos?: number;
  nextSteps?: { title: string; subtitle: string; icon?: string }[];
  featuredProject?: {
    title: string;
    description: string;
    difficulty: string;
    duration: string;
  } | null;
  nextDeadlineDays?: number;
}

function demoDashboardData(): DashboardData {
  return {
    profile: {
      dreamRole: "Full Stack Engineer",
      careerReadinessScore: 72,
      skillGapScore: 68,
      resumeHealth: 78,
      atsScore: 82,
      githubHealth: 71,
      weeklyGoalHours: 5,
      weeklyProgressHours: 3,
      onboardingComplete: true,
    },
    stats: { skillsCount: 48, gapsCount: 12, projectsCount: 3, rank: "Top 8%" },
    missingSkills: [
      { name: "Docker", priority: "critical" },
      { name: "Redis", priority: "medium" },
    ],
    recommendations: [
      "Focus on Docker — highest market demand for your role.",
      "Complete the Redis chat project to boost portfolio value.",
      "Connect GitHub for deeper code quality metrics.",
    ],
    skillRadar: [
      { skill: "React", score: 85 },
      { skill: "Node.js", score: 70 },
      { skill: "TypeScript", score: 78 },
      { skill: "AWS", score: 45 },
      { skill: "Docker", score: 30 },
      { skill: "SQL", score: 65 },
    ],
    recentActivity: [
      { action: "Resume analyzed", time: "2 hours ago" },
      { action: "GitHub profile synced", time: "1 day ago" },
      { action: "Roadmap updated", time: "3 days ago" },
    ],
    jobMatches: [
      { company: "Stripe", title: "Full Stack Engineer", match: 87 },
      { company: "Vercel", title: "Frontend Engineer", match: 82 },
      { company: "OpenAI", title: "Software Engineer", match: 76 },
    ],
    marketTrends: [
      { skill: "React", demand: 95 },
      { skill: "TypeScript", demand: 92 },
      { skill: "Docker", demand: 88 },
      { skill: "AWS", demand: 85 },
      { skill: "K8s", demand: 78 },
      { skill: "Go", demand: 72 },
    ],
    firstName: "there",
    streak: 7,
    heroMessage: "Today's outlook is promising. Your recent Python project has boosted your profile visibility by 12%. To hit your \"Senior Engineer\" target by June, let's focus on cloud architecture today.",
    todayGoal: "API OPTIMIZATION",
    atsMissingKeywords: "3 critical keywords missing for \"Senior Cloud Architect\" roles.",
    activeRepos: 4,
    nextSteps: [
      { title: "Finish Kubernetes Certification", subtitle: "Estimated 4 hours remaining to mastery.", icon: "school" },
      { title: "Update LinkedIn Project Section", subtitle: "Your new 'EcoTracker' project is ready to showcase.", icon: "share" },
    ],
    featuredProject: {
      title: "Serverless Inventory Orchestrator",
      description: "Build a scalable event-driven architecture using AWS Lambda and DynamoDB for real-time inventory tracking.",
      difficulty: "Advanced",
      duration: "3 Weeks",
    },
    nextDeadlineDays: 2,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  try {
    const user = await getOrCreateUser();
    if (!user?.profile) return demoDashboardData();

    const dreamRole = user.profile.dreamRole ?? "Full Stack Engineer";
    const parsed = user.resumes[0]?.parsedData as ParsedResume | null;
    const resumeSkills = parsed?.skills ?? [];
    const githubLangs = Object.keys(
      (user.githubProfile?.languages as Record<string, number>) ?? {}
    );
    const skillsCount = new Set([...resumeSkills, ...githubLangs]).size;

    const jobs = await fetchRemoteOKJobs(dreamRole);
    const insights = generateMarketInsights(dreamRole, jobs);

    const skillRadar = insights.trendingSkills.slice(0, 6).map((t) => ({
      skill: t.skill,
      score: t.demand,
    }));

    const readiness = user.profile.careerReadinessScore ?? 72;
    const rank =
      readiness >= 90 ? "Top 1%" : readiness >= 80 ? "Top 5%" : readiness >= 70 ? "Top 8%" : "Top 20%";

    return {
      profile: {
        dreamRole,
        careerReadinessScore: user.profile.careerReadinessScore ?? 72,
        skillGapScore: user.profile.skillGapScore ?? 68,
        resumeHealth: user.profile.resumeHealth ?? 78,
        atsScore: user.profile.atsScore ?? 82,
        githubHealth: user.profile.githubHealth ?? 71,
        weeklyGoalHours: user.profile.weeklyGoalHours,
        weeklyProgressHours: user.profile.weeklyProgressHours,
        onboardingComplete: user.profile.onboardingComplete,
      },
      stats: {
        skillsCount: skillsCount || 48,
        gapsCount: user.skillGaps.length || 12,
        projectsCount: user.projects.length || 3,
        rank,
      },
      missingSkills: user.skillGaps.slice(0, 5).map((g: { skill: { name: string }; priority: string }) => ({
        name: g.skill.name,
        priority: g.priority,
      })),
      recommendations: [
        user.skillGaps[0]
          ? `Focus on ${user.skillGaps[0].skill.name} — ${user.skillGaps[0].whyItMatters ?? "high market demand"}.`
          : "Complete onboarding to get personalized recommendations.",
        "Review your roadmap for the next milestone.",
        "Practice interview questions in Interview Prep.",
      ],
      skillRadar: skillRadar.length ? skillRadar : demoDashboardData().skillRadar,
      recentActivity: [
        { action: "Profile analyzed", time: "Recently" },
        ...(user.githubProfile
          ? [{ action: "GitHub synced", time: "Recently" }]
          : []),
      ],
      jobMatches: jobs.slice(0, 3).map((j) => ({
        company: j.company,
        title: j.title,
        match: Math.round(70 + Math.random() * 25),
      })),
      marketTrends: insights.trendingSkills.slice(0, 6).map((t) => ({
        skill: t.skill,
        demand: t.demand,
      })),
      // Enhanced dashboard fields
      firstName: user.firstName ?? undefined,
      streak: 7, // TODO: calculate from learning progress
      heroMessage: user.skillGaps[0]
        ? `Your recent ${user.githubProfile ? "GitHub" : "resume"} analysis has boosted your profile visibility. To hit your "${dreamRole}" target, let's focus on ${user.skillGaps[0].skill.name} today.`
        : `Welcome back! Your career intelligence dashboard is ready. Let's make progress toward your ${dreamRole} goal.`,
      todayGoal: user.skillGaps[0] ? `${user.skillGaps[0].skill.name} MASTERY`.toUpperCase() : "API OPTIMIZATION",
      atsMissingKeywords: user.skillGaps.slice(0, 3).length
        ? `${user.skillGaps.slice(0, 3).map((g: { skill: { name: string } }) => g.skill.name).join(", ")} keywords missing for "${dreamRole}" roles.`
        : "ATS score looks good! Keep updating your resume.",
      activeRepos: user.githubProfile?.publicRepos ?? 4,
      nextSteps: [
        user.skillGaps[0]
          ? { title: `Master ${user.skillGaps[0].skill.name}`, subtitle: `Critical for ${dreamRole} roles — estimated ${user.skillGaps[0].estimatedHours}h to mastery.`, icon: "school" }
          : { title: "Finish Kubernetes Certification", subtitle: "Estimated 4 hours remaining to mastery.", icon: "school" },
        user.roadmaps[0]?.milestones[1]
          ? { title: user.roadmaps[0].milestones[1].title, subtitle: "Update your profile with completed work.", icon: "share" }
          : { title: "Update LinkedIn Project Section", subtitle: "Your new project is ready to showcase.", icon: "share" },
      ],
      featuredProject: user.projects[0]
        ? {
            title: user.projects[0].title,
            description: user.projects[0].description,
            difficulty: user.projects[0].difficulty,
            duration: user.projects[0].duration ?? "3 Weeks",
          }
        : null,
      nextDeadlineDays: 2,
    };
  } catch {
    return demoDashboardData();
  }
}

export async function getGapAnalysisData() {
  try {
    const user = await getOrCreateUser();
    if (!user) return null;

    const parsed = user.resumes[0]?.parsedData as ParsedResume | null;
    const currentSkills = [
      ...(parsed?.skills ?? []),
      ...Object.keys((user.githubProfile?.languages as Record<string, number>) ?? {}),
    ];

    return {
      dreamRole: user.profile?.dreamRole ?? "Full Stack Engineer",
      currentSkills: [...new Set(currentSkills)],
      gaps: user.skillGaps.map((g: {
        id: string;
        skill: { name: string };
        priority: string;
        marketImportance: number | null;
        confidenceScore: number | null;
        whyItMatters: string | null;
        companies: string[];
        difficulty: string | null;
        estimatedHours: number | null;
        learningResources: unknown;
        suggestedProjects: unknown;
      }) => ({
        id: g.id,
        skill: g.skill.name,
        priority: g.priority,
        marketImportance: g.marketImportance ?? 0,
        confidenceScore: g.confidenceScore ?? 0,
        whyItMatters: g.whyItMatters ?? "",
        companies: g.companies,
        difficulty: g.difficulty ?? "intermediate",
        estimatedHours: g.estimatedHours ?? 20,
        learningResources: g.learningResources,
        suggestedProjects: g.suggestedProjects,
      })),
      scores: {
        careerReadiness: user.profile?.careerReadinessScore ?? 72,
        skillGap: user.profile?.skillGapScore ?? 68,
      },
    };
  } catch {
    return null;
  }
}

export async function getRoadmapData() {
  try {
    const user = await getOrCreateUser();
    if (!user) return null;

    const roadmap = user.roadmaps[0];
    if (!roadmap) return null;

    return {
      title: roadmap.title,
      fromRole: roadmap.fromRole,
      toRole: roadmap.toRole,
      weeklyGoal: user.profile?.weeklyGoalHours ?? 5,
      weeklyProgress: user.profile?.weeklyProgressHours ?? 3,
      milestones: roadmap.milestones.map((m: {
        id: string;
        title: string;
        description: string | null;
        status: string;
        type: string;
        targetDate: Date | null;
        progress: number;
        learningTopics: unknown;
        projects: unknown;
        estimatedHours: number | null;
        githubRepo: string | null;
      }) => ({
        id: m.id,
        title: m.title,
        description: m.description,
        status: m.status,
        type: m.type,
        targetDate: m.targetDate,
        progress: m.progress,
        learningTopics: (m.learningTopics as string[]) ?? [],
        projects: (m.projects as string[]) ?? [],
        estimatedHours: m.estimatedHours,
        githubRepo: m.githubRepo,
      })),
      dreamRole: user.profile?.dreamRole,
      firstName: user.firstName,
    };
  } catch {
    return null;
  }
}

export async function getProjectsData() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return user.projects.map((p: {
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
    }) => ({
      id: p.id,
      title: p.title,
      description: p.description ?? "",
      skillsCovered: p.skillsCovered,
      difficulty: p.difficulty,
      duration: p.duration,
      resumeImpact: p.resumeImpact,
      portfolioValue: p.portfolioValue,
      progress: p.progress,
      status: p.status,
    }));
  } catch {
    return [];
  }
}

export async function getApplicationsData() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return await prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { orderIndex: "asc" },
    });
  } catch {
    return [];
  }
}

export async function getReportsData() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return await prisma.report.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export async function getInterviewSessions() {
  try {
    const user = await getOrCreateUser();
    if (!user) return [];

    return await prisma.interviewSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
  } catch {
    return [];
  }
}
