import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

export interface ReportData {
  name: string;
  email: string;
  dreamRole: string;
  careerReadinessScore: number;
  atsScore: number;
  githubHealth: number;
  resumeHealth: number;
  skillGapScore: number;
  currentSkills: string[];
  missingSkills: { name: string; priority: string; marketImportance: number }[];
  roadmapTitle: string;
  generatedAt: Date;
}

const BRAND_PURPLE = rgb(0.369, 0.231, 0.859); // #5e3bdb
const DARK = rgb(0.047, 0.031, 0.102); // #0c0819
const GRAY = rgb(0.565, 0.533, 0.62); // #908e9e
const LIGHT_BG = rgb(0.965, 0.953, 0.988); // #f6f3fc
const WHITE = rgb(1, 1, 1);

export async function generateCareerReport(data: ReportData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();

  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);

  // ── Header Banner ─────────────────────────────────────────────
  page.drawRectangle({
    x: 0,
    y: height - 120,
    width,
    height: 120,
    color: BRAND_PURPLE,
  });

  // App name
  page.drawText("SkillGap AI", {
    x: 40,
    y: height - 45,
    size: 22,
    font: helveticaBold,
    color: WHITE,
  });

  // Report title
  page.drawText("Career Intelligence Report", {
    x: 40,
    y: height - 70,
    size: 13,
    font: helvetica,
    color: rgb(0.8, 0.7, 1.0),
  });

  // Generated date
  const dateStr = data.generatedAt.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  page.drawText(dateStr, {
    x: width - 180,
    y: height - 55,
    size: 11,
    font: helvetica,
    color: rgb(0.8, 0.7, 1.0),
  });

  // ── Profile Section ───────────────────────────────────────────
  let y = height - 160;

  page.drawText(data.name, {
    x: 40,
    y,
    size: 20,
    font: helveticaBold,
    color: DARK,
  });
  y -= 22;
  page.drawText(`Target Role: ${data.dreamRole}`, {
    x: 40,
    y,
    size: 12,
    font: helvetica,
    color: GRAY,
  });

  // ── Score Cards Row ───────────────────────────────────────────
  y -= 50;
  const scores = [
    { label: "Career Readiness", value: data.careerReadinessScore },
    { label: "ATS Score", value: data.atsScore },
    { label: "GitHub Health", value: data.githubHealth },
    { label: "Resume Health", value: data.resumeHealth },
  ];
  const cardW = (width - 80 - 30) / 4;

  scores.forEach((score, i) => {
    const x = 40 + i * (cardW + 10);
    // Card background
    page.drawRectangle({ x, y: y - 60, width: cardW, height: 70, color: LIGHT_BG });
    // Score value
    page.drawText(`${score.value}`, {
      x: x + 10,
      y: y - 20,
      size: 22,
      font: helveticaBold,
      color: BRAND_PURPLE,
    });
    // Label
    page.drawText(score.label, {
      x: x + 10,
      y: y - 42,
      size: 9,
      font: helvetica,
      color: GRAY,
    });
    // Progress bar bg
    page.drawRectangle({ x: x + 10, y: y - 55, width: cardW - 20, height: 4, color: rgb(0.9, 0.9, 0.95) });
    // Progress bar fill
    page.drawRectangle({
      x: x + 10,
      y: y - 55,
      width: ((cardW - 20) * score.value) / 100,
      height: 4,
      color: BRAND_PURPLE,
    });
  });

  // ── Current Skills Section ────────────────────────────────────
  y -= 90;
  page.drawText("Current Skills", {
    x: 40,
    y,
    size: 14,
    font: helveticaBold,
    color: DARK,
  });
  y -= 8;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: LIGHT_BG });
  y -= 20;

  let skillX = 40;
  const skillsToShow = data.currentSkills.slice(0, 16);
  for (const skill of skillsToShow) {
    const skillW = helvetica.widthOfTextAtSize(skill, 10) + 16;
    if (skillX + skillW > width - 40) {
      skillX = 40;
      y -= 28;
    }
    // Pill background
    page.drawRectangle({ x: skillX, y: y - 16, width: skillW, height: 22, color: LIGHT_BG });
    page.drawText(skill, {
      x: skillX + 8,
      y: y - 8,
      size: 10,
      font: helvetica,
      color: BRAND_PURPLE,
    });
    skillX += skillW + 8;
  }

  // ── Missing Skills Section ────────────────────────────────────
  y -= 50;
  page.drawText("Priority Skill Gaps", {
    x: 40,
    y,
    size: 14,
    font: helveticaBold,
    color: DARK,
  });
  y -= 8;
  page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 0.5, color: LIGHT_BG });
  y -= 20;

  const PRIORITY_COLORS: Record<string, ReturnType<typeof rgb>> = {
    critical: rgb(0.8, 0.2, 0.2),
    high: rgb(0.6, 0.4, 0.1),
    medium: rgb(0.1, 0.4, 0.8),
    low: GRAY,
  };

  const gapsToShow = data.missingSkills.slice(0, 6);
  for (const gap of gapsToShow) {
    // Row background
    page.drawRectangle({ x: 40, y: y - 20, width: width - 80, height: 28, color: LIGHT_BG });
    // Skill name
    page.drawText(gap.name, { x: 50, y: y - 10, size: 11, font: helveticaBold, color: DARK });
    // Priority
    const pColor = PRIORITY_COLORS[gap.priority] ?? GRAY;
    page.drawText(gap.priority.toUpperCase(), {
      x: 200,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: pColor,
    });
    // Market demand bar
    page.drawRectangle({ x: 310, y: y - 14, width: 200, height: 6, color: rgb(0.9, 0.9, 0.95) });
    page.drawRectangle({
      x: 310,
      y: y - 14,
      width: (200 * gap.marketImportance) / 100,
      height: 6,
      color: pColor,
    });
    // Percentage
    page.drawText(`${gap.marketImportance}%`, {
      x: 520,
      y: y - 10,
      size: 9,
      font: helveticaBold,
      color: GRAY,
    });
    y -= 35;
    if (y < 100) break;
  }

  // ── Footer ────────────────────────────────────────────────────
  page.drawRectangle({ x: 0, y: 0, width, height: 50, color: LIGHT_BG });
  page.drawText("Generated by SkillGap AI — skillgap.ai", {
    x: 40,
    y: 18,
    size: 10,
    font: helvetica,
    color: GRAY,
  });
  page.drawText(`Roadmap: ${data.roadmapTitle}`, {
    x: width - 300,
    y: 18,
    size: 10,
    font: helvetica,
    color: GRAY,
  });

  return doc.save();
}
