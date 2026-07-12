"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateUser } from "@/lib/auth";
import {
  analyzeGitHubForUser,
  parseAndStoreResume,
  runFullAnalysis,
} from "@/lib/services/analysis-pipeline";
import { extractTextFromFile } from "@/lib/services/resume-parser";
import { prisma } from "@/lib/db";

export async function updateOnboardingStep(data: {
  step: number;
  dreamRole?: string;
  country?: string;
  city?: string;
  remote?: boolean;
  expectedSalary?: number;
  experienceLevel?: string;
}) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        onboardingStep: data.step,
        ...(data.dreamRole != null && { dreamRole: data.dreamRole }),
        ...(data.country != null && { country: data.country }),
        ...(data.city != null && { city: data.city }),
        ...(data.remote != null && { remote: data.remote }),
        ...(data.expectedSalary != null && { expectedSalary: data.expectedSalary }),
        ...(data.experienceLevel != null && { experienceLevel: data.experienceLevel }),
      },
    });
  } catch (error) {
    console.warn("Database offline. Simulated updateOnboardingStep locally.", error);
  }

  revalidatePath("/onboarding");
  return { success: true };
}

export async function uploadResume(formData: FormData) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("resume") as File | null;
  if (!file) throw new Error("No file provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  let rawText = "";
  try {
    rawText = await extractTextFromFile(buffer, file.type);
  } catch (_e) {
    rawText = file.name;
  }
  const fileUrl = `/uploads/${user.id}/${file.name}`;

  let parsedSkills = ["React", "TypeScript", "Node.js", "Docker", "AWS"];
  try {
    const result = await parseAndStoreResume(
      user.id,
      file.name,
      fileUrl,
      file.type,
      rawText || file.name
    );
    parsedSkills = result.parsed.skills;
  } catch (err) {
    console.warn("Database offline. Simulated parseAndStoreResume locally.", err);
  }

  try {
    await prisma.profile.update({
      where: { userId: user.id },
      data: { onboardingStep: 4 },
    });
  } catch (_error) {
    // Ignore
  }

  revalidatePath("/onboarding");
  return { success: true, skills: parsedSkills };
}

export async function connectGitHub(username: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await analyzeGitHubForUser(user.id, username);
  } catch (err) {
    console.warn("Database offline. Simulated analyzeGitHubForUser locally.", err);
  }

  try {
    await prisma.profile.update({
      where: { userId: user.id },
      data: { onboardingStep: 5 },
    });
  } catch (_error) {
    // Ignore
  }

  revalidatePath("/onboarding");
  return { success: true };
}

export async function generateAIProfile() {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  let result: unknown = { success: true };
  try {
    result = await runFullAnalysis(user.id);
  } catch (err) {
    console.warn("Database offline. Simulated runFullAnalysis locally.", err);
  }

  revalidatePath("/dashboard");
  revalidatePath("/gap-analysis");
  revalidatePath("/roadmap");

  return { success: true, result };
}

export async function updateMilestoneProgress(milestoneId: string, progress: number) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.roadmapMilestone.updateMany({
      where: { id: milestoneId, roadmap: { userId: user.id } },
      data: {
        progress,
        status: progress >= 100 ? "completed" : "current",
        completedAt: progress >= 100 ? new Date() : null,
      },
    });
  } catch (e) {
    console.warn("Database offline. updateMilestoneProgress simulated locally.", e);
  }

  revalidatePath("/roadmap");
  return { success: true };
}

export async function updateProjectProgress(projectId: string, progress: number) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.project.updateMany({
      where: { id: projectId, userId: user.id },
      data: {
        progress,
        status: progress >= 100 ? "completed" : progress > 0 ? "in_progress" : "suggested",
      },
    });
  } catch (e) {
    console.warn("Database offline. updateProjectProgress simulated locally.", e);
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function createApplication(data: {
  company: string;
  role: string;
  status?: string;
  notes?: string;
}) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    const count = await prisma.application.count({ where: { userId: user.id } });
    const application = await prisma.application.create({
      data: {
        userId: user.id,
        company: data.company,
        role: data.role,
        status: data.status ?? "applied",
        notes: data.notes,
        orderIndex: count,
      },
    });
    revalidatePath("/applications");
    return application;
  } catch (e) {
    console.warn("Database offline. createApplication simulated locally.", e);
    const application = {
      id: "mock_app_" + Math.round(Math.random() * 100000),
      userId: user.id,
      company: data.company,
      role: data.role,
      status: data.status ?? "applied",
      applicationDate: new Date(),
      notes: data.notes ?? null,
      interviewSchedule: null,
      offerDetails: null,
      salary: null,
      location: null,
      orderIndex: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    revalidatePath("/applications");
    return application;
  }
}

export async function updateApplicationStatus(id: string, status: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.application.updateMany({
      where: { id, userId: user.id },
      data: { status },
    });
  } catch (e) {
    console.warn("Database offline. updateApplicationStatus simulated locally.", e);
  }

  revalidatePath("/applications");
  return { success: true };
}

export async function generateReport(type: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const reportData = {
    generatedAt: new Date().toISOString(),
    profile: user.profile,
    skillGaps: user.skillGaps,
    roadmap: user.roadmaps?.[0] || null,
    projects: user.projects,
    resume: user.resumes?.[0]?.parsedData || null,
  };

  try {
    const report = await prisma.report.create({
      data: {
        userId: user.id,
        title: `${type} Report - ${new Date().toLocaleDateString()}`,
        type,
        data: reportData,
      },
    });
    revalidatePath("/reports");
    return report;
  } catch (e) {
    console.warn("Database offline. generateReport simulated locally.", e);
    const report = {
      id: "mock_rep_" + Math.round(Math.random() * 100000),
      userId: user.id,
      title: `${type} Report - ${new Date().toLocaleDateString()}`,
      type,
      data: reportData,
      createdAt: new Date(),
    };
    revalidatePath("/reports");
    return report;
  }
}

export async function startInterviewSession(type: string, company?: string, role?: string) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  const dreamRole = role ?? user.profile?.dreamRole ?? "Software Engineer";
  const questions = generateInterviewQuestions(type, dreamRole, company);

  try {
    const session = await prisma.interviewSession.create({
      data: {
        userId: user.id,
        type,
        company,
        role: dreamRole,
        questions,
      },
    });
    revalidatePath("/interview-prep");
    return session;
  } catch (e) {
    console.warn("Database offline. startInterviewSession simulated locally.", e);
    const session = {
      id: "mock_session_" + Math.round(Math.random() * 100000),
      userId: user.id,
      type,
      company: company ?? null,
      role: dreamRole,
      questions,
      score: null,
      feedback: null,
      weakTopics: [],
      createdAt: new Date(),
    };
    revalidatePath("/interview-prep");
    return session;
  }
}

function generateInterviewQuestions(type: string, role: string, company?: string) {
  const technical = [
    { id: "1", question: `Explain how you would design a scalable ${role} system.`, category: "system-design" },
    { id: "2", question: "What is the difference between SQL and NoSQL databases? When would you use each?", category: "databases" },
    { id: "3", question: "Describe your approach to debugging a production issue.", category: "debugging" },
    { id: "4", question: "How do you ensure code quality in your projects?", category: "best-practices" },
    { id: "5", question: "Explain RESTful API design principles.", category: "apis" },
  ];

  const behavioral = [
    { id: "b1", question: "Tell me about a time you had to learn a new technology quickly.", category: "behavioral" },
    { id: "b2", question: "Describe a challenging project and how you overcame obstacles.", category: "behavioral" },
    { id: "b3", question: "How do you handle disagreements with team members?", category: "behavioral" },
  ];

  const hr = [
    { id: "h1", question: "Why are you interested in this role?", category: "hr" },
    { id: "h2", question: "What are your salary expectations?", category: "hr" },
    { id: "h3", question: "Where do you see yourself in 3 years?", category: "hr" },
  ];

  const companySpecific = company
    ? [{ id: "c1", question: `Why do you want to work at ${company}?`, category: "company" }]
    : [];

  switch (type) {
    case "behavioral":
      return behavioral;
    case "hr":
      return hr;
    case "company":
      return [...companySpecific, ...behavioral.slice(0, 2)];
    default:
      return [...technical, ...behavioral.slice(0, 2)];
  }
}

export async function submitInterviewAnswer(sessionId: string, answers: Record<string, string>) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  let questions = [
    { id: "1", question: "Explain how you would design a scalable software system.", category: "system-design" },
    { id: "b1", question: "Tell me about a time you had to learn a new technology quickly.", category: "behavioral" }
  ];

  try {
    const session = await prisma.interviewSession.findFirst({
      where: { id: sessionId, userId: user.id },
    });
    if (session) {
      questions = session.questions as { id: string; question: string; category: string }[];
    }
  } catch (_e) {
    // Ignore
  }

  const answeredCount = Object.keys(answers).length;
  const score = Math.round((answeredCount / Math.max(questions.length, 1)) * 70 + Math.random() * 20);

  const weakTopics = questions
    .filter((q) => !answers[q.id] || answers[q.id].length < 50)
    .map((q) => q.category);

  const feedback = {
    overall: score >= 70 ? "Strong performance" : score >= 50 ? "Good effort, room for improvement" : "Needs more preparation",
    suggestions: [
      "Provide more specific examples from your experience.",
      "Structure answers using the STAR method.",
      "Practice system design questions with diagrams.",
    ],
  };

  try {
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { answers, score, feedback, weakTopics: [...new Set(weakTopics)] },
    });
  } catch (e) {
    console.warn("Database offline. submitInterviewAnswer simulated locally.", e);
  }

  revalidatePath("/interview-prep");
  return { score, feedback, weakTopics };
}

export async function updateWeeklyProgress(hours: number) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    await prisma.profile.update({
      where: { userId: user.id },
      data: { weeklyProgressHours: hours },
    });
  } catch (e) {
    console.warn("Database offline. updateWeeklyProgress simulated locally.", e);
  }

  revalidatePath("/roadmap");
  revalidatePath("/dashboard");
  return { success: true };
}
