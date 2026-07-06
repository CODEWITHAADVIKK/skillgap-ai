import { structuredCompletion } from "./openai";

export interface ParsedResume {
  education: { institution: string; degree: string; year?: string }[];
  experience: { company: string; role: string; duration?: string; highlights: string[] }[];
  skills: string[];
  projects: { name: string; description: string; technologies: string[] }[];
  certifications: { name: string; issuer?: string; year?: string }[];
  languages: string[];
  frameworks: string[];
  tools: string[];
  achievements: string[];
}

const RESUME_SYSTEM_PROMPT = `You are an expert resume parser. Extract structured data from resume text.
Return JSON with keys: education, experience, skills, projects, certifications, languages, frameworks, tools, achievements.
Be thorough and infer skills from experience descriptions.`;

export async function parseResumeText(rawText: string): Promise<ParsedResume> {
  const parsed = await structuredCompletion<ParsedResume>(
    RESUME_SYSTEM_PROMPT,
    `Parse this resume:\n\n${rawText.slice(0, 12000)}`
  );

  if (parsed) return parsed;

  return {
    education: [],
    experience: [],
    skills: extractKeywords(rawText),
    projects: [],
    certifications: [],
    languages: [],
    frameworks: [],
    tools: [],
    achievements: [],
  };
}

function extractKeywords(text: string): string[] {
  const common = [
    "JavaScript", "TypeScript", "Python", "React", "Node.js", "AWS",
    "Docker", "Kubernetes", "SQL", "PostgreSQL", "MongoDB", "Git",
    "Java", "C++", "Go", "Rust", "Tailwind", "Next.js", "GraphQL",
  ];
  const lower = text.toLowerCase();
  return common.filter((skill) => lower.includes(skill.toLowerCase()));
}

export async function extractTextFromFile(
  buffer: Buffer,
  fileType: string
): Promise<string> {
  if (fileType.includes("pdf")) {
    return extractPdfText(buffer);
  }
  if (fileType.includes("word") || fileType.includes("docx")) {
    return buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ");
  }
  return buffer.toString("utf-8");
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const text = buffer.toString("utf-8");
    const matches = text.match(/\(([^)]+)\)/g);
    if (matches) {
      return matches.map((m) => m.slice(1, -1)).join(" ");
    }
    return text.replace(/[^\x20-\x7E\n\r\t]/g, " ").slice(0, 15000);
  } catch {
    return "";
  }
}
