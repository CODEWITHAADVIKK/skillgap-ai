export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  requiredSkills: string[];
  preferredSkills: string[];
  experience?: string;
  url?: string;
  source: string;
}

export interface MarketInsights {
  trendingSkills: { skill: string; demand: number; growth: number }[];
  salaryInsights: { role: string; min: number; max: number; median: number }[];
  hiringTrends: { month: string; count: number }[];
  topCompanies: string[];
}

const ROLE_SKILLS: Record<string, string[]> = {
  "Frontend Developer": ["React", "TypeScript", "CSS", "Next.js", "Tailwind CSS", "JavaScript", "Git", "Testing", "Performance", "Accessibility"],
  "Backend Developer": ["Node.js", "Python", "PostgreSQL", "Docker", "Redis", "REST APIs", "GraphQL", "AWS", "Microservices", "System Design"],
  "Full Stack Engineer": ["React", "Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS", "Redis", "Next.js", "CI/CD", "System Design"],
  "AI Engineer": ["Python", "PyTorch", "TensorFlow", "LLMs", "LangChain", "MLOps", "Vector DBs", "FastAPI", "Docker", "AWS"],
  "Data Scientist": ["Python", "SQL", "Pandas", "Scikit-learn", "Statistics", "ML", "Visualization", "Spark", "A/B Testing", "Deep Learning"],
  "Cloud Engineer": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "Linux", "Networking", "Lambda", "S3", "CloudFormation"],
};

export function getMarketSkillsForRole(role: string): string[] {
  return ROLE_SKILLS[role] ?? ROLE_SKILLS["Full Stack Engineer"];
}

export async function fetchRemoteOKJobs(role: string): Promise<JobPosting[]> {
  try {
    const response = await fetch("https://remoteok.com/api", {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return getMockJobs(role);

    const data = (await response.json()) as RemoteOKJob[];
    const keywords = role.toLowerCase().split(" ");

    return data
      .slice(1, 51)
      .filter((job) => {
        const title = (job.position ?? "").toLowerCase();
        return keywords.some((k) => title.includes(k)) || title.includes("engineer") || title.includes("developer");
      })
      .map((job, i) => ({
        id: `remoteok-${job.id ?? i}`,
        title: job.position ?? "Software Engineer",
        company: job.company ?? "Unknown",
        location: job.location ?? "Remote",
        remote: true,
        salaryMin: parseSalary(job.salary_min),
        salaryMax: parseSalary(job.salary_max),
        requiredSkills: extractSkillsFromTags(job.tags ?? []),
        preferredSkills: [],
        url: job.url,
        source: "remoteok",
      }))
      .slice(0, 20);
  } catch {
    return getMockJobs(role);
  }
}

interface RemoteOKJob {
  id?: number;
  position?: string;
  company?: string;
  location?: string;
  salary_min?: number | string;
  salary_max?: number | string;
  tags?: string[];
  url?: string;
}

function parseSalary(value: number | string | undefined): number | undefined {
  if (value == null) return undefined;
  const num = typeof value === "string" ? parseInt(value, 10) : value;
  return isNaN(num) ? undefined : num;
}

function extractSkillsFromTags(tags: string[]): string[] {
  const techTags = tags.filter(
    (t) => !["remote", "full-time", "part-time", "contract"].includes(t.toLowerCase())
  );
  return techTags.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).slice(0, 10);
}

function getMockJobs(role: string): JobPosting[] {
  const companies = ["Stripe", "Vercel", "OpenAI", "Google", "Microsoft", "Amazon", "Meta", "Netflix"];
  const skills = getMarketSkillsForRole(role);

  return companies.map((company, i) => ({
    id: `mock-${i}`,
    title: role,
    company,
    location: i % 2 === 0 ? "Remote" : "San Francisco, CA",
    remote: i % 2 === 0,
    salaryMin: 120000 + i * 10000,
    salaryMax: 180000 + i * 15000,
    requiredSkills: skills.slice(0, 6),
    preferredSkills: skills.slice(6, 10),
    experience: "2-5 years",
    source: "mock",
  }));
}

export function generateMarketInsights(role: string, jobs: JobPosting[]): MarketInsights {
  const skillCounts: Record<string, number> = {};

  for (const job of jobs) {
    for (const skill of [...job.requiredSkills, ...job.preferredSkills]) {
      skillCounts[skill] = (skillCounts[skill] ?? 0) + 1;
    }
  }

  const maxCount = Math.max(...Object.values(skillCounts), 1);
  const trendingSkills = Object.entries(skillCounts)
    .map(([skill, count]) => ({
      skill,
      demand: Math.round((count / maxCount) * 100),
      growth: Math.round(10 + Math.random() * 30),
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 12);

  const salaries = jobs.filter((j) => j.salaryMin && j.salaryMax);
  const mins = salaries.map((j) => j.salaryMin!);
  const maxs = salaries.map((j) => j.salaryMax!);

  return {
    trendingSkills,
    salaryInsights: [
      {
        role,
        min: mins.length ? Math.min(...mins) : 90000,
        max: maxs.length ? Math.max(...maxs) : 200000,
        median: mins.length ? Math.round(mins.reduce((a, b) => a + b, 0) / mins.length) : 140000,
      },
    ],
    hiringTrends: [
      { month: "Jan", count: 120 },
      { month: "Feb", count: 145 },
      { month: "Mar", count: 168 },
      { month: "Apr", count: 190 },
      { month: "May", count: 210 },
      { month: "Jun", count: 235 },
    ],
    topCompanies: [...new Set(jobs.map((j) => j.company))].slice(0, 8),
  };
}
