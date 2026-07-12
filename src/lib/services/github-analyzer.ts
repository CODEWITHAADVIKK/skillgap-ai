export interface GitHubAnalysis {
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  publicRepos: number;
  followers: number;
  languages: Record<string, number>;
  frameworks: string[];
  repositories: GitHubRepoAnalysis[];
  contributionScore: number;
  overallHealth: number;
}

export interface GitHubRepoAnalysis {
  name: string;
  fullName: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  readmeQuality: number;
  complexity: number;
  documentation: number;
  url: string;
}

const FRAMEWORK_MAP: Record<string, string[]> = {
  JavaScript: ["React", "Vue", "Angular", "Next.js", "Express"],
  TypeScript: ["React", "Next.js", "NestJS", "Angular"],
  Python: ["Django", "Flask", "FastAPI", "PyTorch", "TensorFlow"],
  Go: ["Gin", "Echo", "Fiber"],
  Ruby: ["Rails"],
  Java: ["Spring"],
};

export async function analyzeGitHubProfile(
  username: string,
  accessToken?: string
): Promise<GitHubAnalysis> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const [userRes, reposRes] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`, { headers }),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
      headers,
    }),
  ]);

  if (!userRes.ok) {
    throw new Error(`GitHub user not found: ${username}`);
  }

  const user = (await userRes.json()) as {
    login: string;
    avatar_url: string;
    bio: string | null;
    public_repos: number;
    followers: number;
  };

  const repos = reposRes.ok
    ? ((await reposRes.json()) as GitHubRepoRaw[])
    : [];

  const languages: Record<string, number> = {};
  const repoAnalyses: GitHubRepoAnalysis[] = [];

  for (const repo of repos.slice(0, 15)) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1;
    }

    repoAnalyses.push({
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      topics: repo.topics ?? [],
      readmeQuality: scoreReadme(repo),
      complexity: scoreComplexity(repo),
      documentation: scoreDocumentation(repo),
      url: repo.html_url,
    });
  }

  const frameworks = inferFrameworks(languages, repos);
  const contributionScore = Math.min(
    100,
    repos.length * 3 + user.followers * 0.5 + repoAnalyses.reduce((s, r) => s + r.stars, 0) * 0.2
  );
  const overallHealth = Math.round(
    (contributionScore * 0.4 +
      repoAnalyses.reduce((s, r) => s + r.readmeQuality, 0) / Math.max(repoAnalyses.length, 1) * 0.3 +
      repoAnalyses.reduce((s, r) => s + r.documentation, 0) / Math.max(repoAnalyses.length, 1) * 0.3)
  );

  return {
    username: user.login,
    avatarUrl: user.avatar_url,
    bio: user.bio,
    publicRepos: user.public_repos,
    followers: user.followers,
    languages,
    frameworks,
    repositories: repoAnalyses,
    contributionScore: Math.round(contributionScore),
    overallHealth,
  };
}

interface GitHubRepoRaw {
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  html_url: string;
  has_wiki: boolean;
  open_issues_count: number;
  size: number;
}

function scoreReadme(repo: GitHubRepoRaw): number {
  let score = 40;
  if (repo.description) score += 20;
  if (repo.topics && repo.topics.length > 0) score += 20;
  if (repo.stargazers_count > 0) score += 10;
  if (repo.has_wiki) score += 10;
  return Math.min(100, score);
}

function scoreComplexity(repo: GitHubRepoRaw): number {
  return Math.min(100, Math.round((repo.size / 1000) * 10 + repo.forks_count * 5));
}

function scoreDocumentation(repo: GitHubRepoRaw): number {
  let score = 30;
  if (repo.description && repo.description.length > 50) score += 30;
  if (repo.topics && repo.topics.length >= 3) score += 20;
  if (repo.has_wiki) score += 20;
  return Math.min(100, score);
}

function inferFrameworks(
  languages: Record<string, number>,
  repos: GitHubRepoRaw[]
): string[] {
  const frameworks = new Set<string>();

  for (const lang of Object.keys(languages)) {
    for (const fw of FRAMEWORK_MAP[lang] ?? []) {
      frameworks.add(fw);
    }
  }

  for (const repo of repos) {
    for (const topic of repo.topics ?? []) {
      frameworks.add(topic.charAt(0).toUpperCase() + topic.slice(1));
    }
    const name = repo.name.toLowerCase();
    if (name.includes("next")) frameworks.add("Next.js");
    if (name.includes("react")) frameworks.add("React");
    if (name.includes("django")) frameworks.add("Django");
    if (name.includes("fastapi")) frameworks.add("FastAPI");
  }

  return Array.from(frameworks).slice(0, 15);
}
