import { NextResponse } from "next/server";
import { chatCompletion } from "@/lib/services/openai";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const user = await getOrCreateUser();
    const body = (await request.json()) as {
      messages: { role: "user" | "assistant"; content: string }[];
    };

    let context = "";
    if (user) {
      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          profile: true,
          skillGaps: { include: { skill: true }, take: 10 },
          roadmaps: { include: { milestones: { take: 5 } }, take: 1 },
          projects: { take: 5 },
          githubProfile: true,
        },
      });

      if (fullUser) {
        context = `
User Profile:
- Dream Role: ${fullUser.profile?.dreamRole ?? "Not set"}
- Experience: ${fullUser.profile?.experienceLevel ?? "Not set"}
- Career Readiness: ${fullUser.profile?.careerReadinessScore ?? "N/A"}
- Skill Gaps: ${fullUser.skillGaps.map((g: { skill: { name: string } }) => g.skill.name).join(", ") || "None analyzed yet"}
- Active Projects: ${fullUser.projects.map((p: { title: string }) => p.title).join(", ") || "None"}
- GitHub: ${fullUser.githubProfile?.githubUsername ?? "Not connected"}
- Roadmap: ${fullUser.roadmaps[0]?.title ?? "Not generated"}
`;
      }
    }

    const systemPrompt = `You are SkillGap AI Career Copilot — an expert career advisor for software engineers and CS students.
You help with resume optimization, skill gap analysis, learning recommendations, interview prep, salary insights, and project suggestions.
Be concise, actionable, and encouraging.${context ? `\n\nUser Context:${context}` : ""}`;

    const reply = await chatCompletion(systemPrompt, body.messages);

    if (user) {
      const lastUserMsg = body.messages.filter((m) => m.role === "user").pop();
      if (lastUserMsg) {
        await prisma.aIChat.create({
          data: { userId: user.id, role: "user", content: lastUserMsg.content },
        });
        await prisma.aIChat.create({
          data: { userId: user.id, role: "assistant", content: reply },
        });
      }
    }

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { message: "Sorry, I encountered an error. Please try again." },
      { status: 500 }
    );
  }
}
