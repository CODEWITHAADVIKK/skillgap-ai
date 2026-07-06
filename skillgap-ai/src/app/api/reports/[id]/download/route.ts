import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateCareerReport } from "@/lib/services/pdf-generator";
import type { ParsedResume } from "@/lib/services/resume-parser";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch report from DB to validate ownership
    const report = await prisma.report.findFirst({
      where: { id, userId: user.id },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Gather data for PDF
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        profile: true,
        skillGaps: { include: { skill: true }, take: 10 },
        resumes: { take: 1 },
        roadmaps: { take: 1 },
      },
    });

    if (!fullUser?.profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const parsed = fullUser.resumes[0]?.parsedData as ParsedResume | null;

    const pdfBytes = await generateCareerReport({
      name: `${fullUser.firstName ?? ""} ${fullUser.lastName ?? ""}`.trim() || "User",
      email: fullUser.email ?? "",
      dreamRole: fullUser.profile.dreamRole ?? "Software Engineer",
      careerReadinessScore: fullUser.profile.careerReadinessScore ?? 72,
      atsScore: fullUser.profile.atsScore ?? 80,
      githubHealth: fullUser.profile.githubHealth ?? 70,
      resumeHealth: fullUser.profile.resumeHealth ?? 75,
      skillGapScore: fullUser.profile.skillGapScore ?? 65,
      currentSkills: parsed?.skills ?? [],
      missingSkills: fullUser.skillGaps.map((g: { skill: { name: string }; priority: string; marketImportance: number | null }) => ({
        name: g.skill.name,
        priority: g.priority,
        marketImportance: g.marketImportance ?? 0,
      })),
      roadmapTitle: fullUser.roadmaps[0]?.title ?? "Career Roadmap",
      generatedAt: new Date(),
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="skillgap-career-report-${new Date().toISOString().split("T")[0]}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF download error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
