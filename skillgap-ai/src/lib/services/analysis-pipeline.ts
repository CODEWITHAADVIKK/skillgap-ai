import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { analyzeGitHubProfile } from "./github-analyzer";
import { fetchRemoteOKJobs, generateMarketInsights, getMarketSkillsForRole } from "./job-engine";
import { parseResumeText, type ParsedResume } from "./resume-parser";
import { generateEmbedding, structuredCompletion } from "./openai";

export interface AnalysisResult {
  careerReadinessScore: number;
  skillGapScore: number;
  resumeHealth: number;
  atsScore: number;
  githubHealth: number;
  currentSkills: string[];
  missingSkills: SkillGapItem[];
  recommendations: string[];
}

export interface SkillGapItem {
  skill: string;
  priority: "critical" | "high" | "medium" | "low";
  marketImportance: number;
  confidenceScore: number;
  whyItMatters: string;
  companies: string[];
  difficulty: string;
  estimatedHours: number;
}

export async function runFullAnalysis(userId: string): Promise<AnalysisResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      resumes: { orderBy: { createdAt: "desc" }, take: 1 },
      githubProfile: { include: { repositories: true } },
    },
  });

  if (!user?.profile) {
    throw new Error("User profile not found");
  }

  const dreamRole = user.profile.dreamRole ?? "Full Stack Engineer";
  const resume = user.resumes[0];
  const parsed = (resume?.parsedData as ParsedResume | null) ?? null;

  let resumeSkills: string[] = parsed?.skills ?? [];
  if (parsed) {
    resumeSkills = [
      ...resumeSkills,
      ...(parsed.frameworks ?? []),
      ...(parsed.tools ?? []),
    ];
  }

  let githubSkills: string[] = [];
  if (user.githubProfile) {
    githubSkills = [
      ...Object.keys((user.githubProfile.languages as Record<string, number>) ?? {}),
      ...((user.githubProfile.frameworks as string[]) ?? []),
    ];
  }

  const currentSkills = [...new Set([...resumeSkills, ...githubSkills].map(normalizeSkill))];
  const marketSkills = getMarketSkillsForRole(dreamRole);
  const jobs = await fetchRemoteOKJobs(dreamRole);
  const insights = generateMarketInsights(dreamRole, jobs);

  for (const { skill, demand } of insights.trendingSkills) {
    if (!marketSkills.includes(skill)) marketSkills.push(skill);
    await upsertSkill(skill, demand);
  }

  const missing = marketSkills.filter(
    (s) => !currentSkills.some((c) => c.toLowerCase() === s.toLowerCase())
  );

  const missingSkills: SkillGapItem[] = missing.map((skill, i) => {
    const trend = insights.trendingSkills.find((t) => t.skill.toLowerCase() === skill.toLowerCase());
    const demand = trend?.demand ?? 50 + Math.round(Math.random() * 40);
    return {
      skill,
      priority: demand > 80 ? "critical" : demand > 60 ? "high" : demand > 40 ? "medium" : "low",
      marketImportance: demand,
      confidenceScore: Math.round(70 + Math.random() * 25),
      whyItMatters: `${skill} is requested in ${Math.round(demand * 0.8)}% of ${dreamRole} job postings.`,
      companies: insights.topCompanies.slice(0, 4),
      difficulty: i < 3 ? "intermediate" : "beginner",
      estimatedHours: 20 + i * 10,
    };
  });

  const coverage = marketSkills.length
    ? ((marketSkills.length - missing.length) / marketSkills.length) * 100
    : 50;

  const resumeHealth = scoreResumeHealth(parsed);
  const atsScore = scoreATS(parsed);
  const githubHealth = user.githubProfile
    ? Math.round(
        ((user.githubProfile.contributionData as { score?: number })?.score ?? 72)
      )
    : 0;

  const careerReadinessScore = Math.round(
    coverage * 0.35 + resumeHealth * 0.25 + atsScore * 0.2 + githubHealth * 0.2
  );
  const skillGapScore = Math.round(100 - (missing.length / Math.max(marketSkills.length, 1)) * 100);

  await prisma.profile.update({
    where: { userId },
    data: {
      careerReadinessScore,
      skillGapScore,
      resumeHealth,
      atsScore,
      githubHealth,
      onboardingComplete: true,
      onboardingStep: 5,
    },
  });

  for (const gap of missingSkills) {
    const skillRecord = await upsertSkill(gap.skill, gap.marketImportance);
    await prisma.skillGap.upsert({
      where: { userId_skillId: { userId, skillId: skillRecord.id } },
      create: {
        userId,
        skillId: skillRecord.id,
        priority: gap.priority,
        marketImportance: gap.marketImportance,
        confidenceScore: gap.confidenceScore,
        whyItMatters: gap.whyItMatters,
        companies: gap.companies,
        difficulty: gap.difficulty,
        estimatedHours: gap.estimatedHours,
      },
      update: {
        priority: gap.priority,
        marketImportance: gap.marketImportance,
        confidenceScore: gap.confidenceScore,
        whyItMatters: gap.whyItMatters,
        companies: gap.companies,
      },
    });
  }

  await generateRoadmap(userId, dreamRole, currentSkills, missingSkills);
  await generateProjects(userId, dreamRole, missingSkills.slice(0, 5));

  const recommendations = [
    `Focus on ${missingSkills[0]?.skill ?? "Docker"} — highest market demand for ${dreamRole}.`,
    `Improve GitHub activity to boost portfolio visibility.`,
    `Complete the suggested project to demonstrate ${missingSkills[1]?.skill ?? "Redis"} skills.`,
  ];

  return {
    careerReadinessScore,
    skillGapScore,
    resumeHealth,
    atsScore,
    githubHealth,
    currentSkills,
    missingSkills,
    recommendations,
  };
}

async function upsertSkill(name: string, demandScore: number) {
  const normalized = normalizeSkill(name);
  const existing = await prisma.skill.findUnique({ where: { name: normalized } });
  if (existing) {
    return prisma.skill.update({
      where: { id: existing.id },
      data: { demandScore, trending: demandScore > 70 },
    });
  }
  const embedding = await generateEmbedding(normalized);
  return prisma.skill.create({
    data: { name: normalized, demandScore, trending: demandScore > 70, embedding },
  });
}

function normalizeSkill(skill: string): string {
  return skill.trim().replace(/\s+/g, " ");
}

function scoreResumeHealth(parsed: ParsedResume | null): number {
  if (!parsed) return 40;
  let score = 30;
  if (parsed.experience.length > 0) score += 25;
  if (parsed.skills.length >= 5) score += 20;
  if (parsed.projects.length > 0) score += 15;
  if (parsed.education.length > 0) score += 10;
  return Math.min(100, score);
}

function scoreATS(parsed: ParsedResume | null): number {
  if (!parsed) return 35;
  let score = 40;
  if (parsed.skills.length >= 8) score += 20;
  if (parsed.experience.some((e) => e.highlights.length >= 3)) score += 20;
  if (parsed.projects.length >= 2) score += 10;
  if (parsed.certifications.length > 0) score += 10;
  return Math.min(100, score);
}

async function generateRoadmap(
  userId: string,
  dreamRole: string,
  currentSkills: string[],
  gaps: SkillGapItem[]
) {
  const existing = await prisma.roadmap.findFirst({
    where: { userId, isActive: true },
  });
  if (existing) return;

  const aiMilestones = await structuredCompletion<{ milestones: MilestoneData[] }>(
    "Generate a career roadmap as JSON with milestones array. Each milestone has: title, description, status (completed/current/upcoming/future), type, estimatedHours, learningTopics (array), projects (array).",
    `Create roadmap from current skills [${currentSkills.join(", ")}] to ${dreamRole}. Missing skills: ${gaps.map((g) => g.skill).join(", ")}.`
  );

  const defaultMilestones: MilestoneData[] = [
    {
      title: "Current Skills",
      description: currentSkills.slice(0, 5).join(", "),
      status: "completed",
      type: "skills",
      estimatedHours: 0,
      learningTopics: currentSkills.slice(0, 5),
      projects: [],
    },
    {
      title: `Project: ${gaps[0]?.skill ?? "Cloud"} Mastery`,
      description: `Build a production-grade project demonstrating ${gaps[0]?.skill ?? "Docker"} and ${gaps[1]?.skill ?? "Redis"} skills.`,
      status: "current",
      type: "project",
      estimatedHours: 40,
      learningTopics: gaps.slice(0, 2).map((g) => g.skill),
      projects: [`Scalable Real-time App with ${gaps[1]?.skill ?? "Redis"}`],
    },
    {
      title: `Certificate: ${dreamRole} Fundamentals`,
      description: "Official validation of core competencies.",
      status: "upcoming",
      type: "certification",
      estimatedHours: 30,
      learningTopics: gaps.slice(2, 4).map((g) => g.skill),
      projects: [],
    },
    {
      title: "Interview Prep & Placement",
      description: `Role-play simulations for ${dreamRole} positions.`,
      status: "future",
      type: "interview",
      estimatedHours: 20,
      learningTopics: ["Behavioral", "System Design", "Technical"],
      projects: [],
    },
  ];

  const milestones = aiMilestones?.milestones ?? defaultMilestones;

  await prisma.roadmap.create({
    data: {
      userId,
      title: `Path to ${dreamRole}`,
      fromRole: "Current Role",
      toRole: dreamRole,
      milestones: {
        create: milestones.map((m, i) => ({
          title: m.title,
          description: m.description,
          status: m.status,
          type: m.type,
          orderIndex: i,
          estimatedHours: m.estimatedHours,
          learningTopics: m.learningTopics,
          projects: m.projects,
          progress: m.status === "completed" ? 100 : m.status === "current" ? 35 : 0,
        })),
      },
    },
  });
}

interface MilestoneData {
  title: string;
  description: string;
  status: string;
  type: string;
  estimatedHours: number;
  learningTopics: string[];
  projects: string[];
}

async function generateProjects(userId: string, dreamRole: string, gaps: SkillGapItem[]) {
  const existing = await prisma.project.count({ where: { userId } });
  if (existing > 0) return;

  const projects = gaps.map((gap, i) => ({
    userId,
    title: `Scalable ${gap.skill} Project`,
    description: `Build a production-ready application showcasing ${gap.skill} for ${dreamRole} roles. Includes deployment, testing, and documentation.`,
    skillsCovered: [gap.skill, ...gaps.slice(i + 1, i + 3).map((g) => g.skill)],
    difficulty: gap.difficulty,
    duration: `${Math.ceil(gap.estimatedHours / 8)} days`,
    resumeImpact: 70 + i * 5,
    portfolioValue: 75 + i * 3,
    status: i === 0 ? "in_progress" : "suggested",
    progress: i === 0 ? 15 : 0,
    resources: [
      { type: "video", title: `${gap.skill} Fundamentals`, url: "#" },
      { type: "docs", title: `Official ${gap.skill} Documentation`, url: "#" },
    ],
  }));

  await prisma.project.createMany({ data: projects });
}

export async function analyzeGitHubForUser(userId: string, username: string) {
  const analysis = await analyzeGitHubProfile(username);

  await prisma.gitHubProfile.upsert({
    where: { userId },
    create: {
      userId,
      githubUsername: analysis.username,
      avatarUrl: analysis.avatarUrl,
      bio: analysis.bio,
      publicRepos: analysis.publicRepos,
      followers: analysis.followers,
      languages: analysis.languages,
      frameworks: analysis.frameworks,
      contributionData: { score: analysis.contributionScore },
      analyzedAt: new Date(),
      repositories: {
        create: analysis.repositories.map((r) => ({
          name: r.name,
          fullName: r.fullName,
          description: r.description,
          language: r.language,
          stars: r.stars,
          forks: r.forks,
          topics: r.topics,
          readmeQuality: r.readmeQuality,
          complexity: r.complexity,
          documentation: r.documentation,
          url: r.url,
        })),
      },
    },
    update: {
      githubUsername: analysis.username,
      avatarUrl: analysis.avatarUrl,
      bio: analysis.bio,
      publicRepos: analysis.publicRepos,
      followers: analysis.followers,
      languages: analysis.languages,
      frameworks: analysis.frameworks,
      contributionData: { score: analysis.contributionScore },
      analyzedAt: new Date(),
    },
  });

  await prisma.profile.update({
    where: { userId },
    data: { githubHealth: analysis.overallHealth },
  });

  return analysis;
}

export async function parseAndStoreResume(
  userId: string,
  fileName: string,
  fileUrl: string,
  fileType: string,
  rawText: string
) {
  const parsed = await parseResumeText(rawText);
  const embedding = await generateEmbedding(rawText.slice(0, 8000));

  const resume = await prisma.resume.create({
    data: {
      userId,
      fileName,
      fileUrl,
      fileType,
      rawText,
      parsedData: JSON.parse(JSON.stringify(parsed)) as Prisma.InputJsonValue,
      embedding,
      education: parsed.education,
      experience: parsed.experience,
      skills: parsed.skills,
      projects: parsed.projects,
      certifications: parsed.certifications,
      languages: parsed.languages,
      frameworks: parsed.frameworks,
      tools: parsed.tools,
      achievements: parsed.achievements,
    },
  });

  for (const skillName of [...parsed.skills, ...parsed.frameworks, ...parsed.tools]) {
    const skill = await upsertSkill(skillName, 50);
    await prisma.resumeSkill.upsert({
      where: { resumeId_skillId: { resumeId: resume.id, skillId: skill.id } },
      create: { resumeId: resume.id, skillId: skill.id, confidence: 0.9 },
      update: {},
    });
  }

  return { resume, parsed };
}
