import Link from "next/link";
import { Header } from "@/components/landing/header";

const DEMO_FEATURES = [
  {
    title: "Resume & GitHub Analysis",
    description:
      "Upload your resume and connect GitHub. Our AI extracts every skill, project, and achievement — then cross-references with live job market data.",
    icon: "analytics",
    accent: "bg-primary",
    stats: "48 skills detected in 30 seconds",
  },
  {
    title: "Real-Time Skill Gap Detection",
    description:
      "We compare your profile against hundreds of live job postings for your dream role and show you exactly what's missing — ranked by market impact.",
    icon: "radar",
    accent: "bg-tertiary",
    stats: "89% accuracy vs manual review",
  },
  {
    title: "AI-Generated Learning Roadmap",
    description:
      "Get a personalized 12-week roadmap with milestones, project ideas, and learning resources — all tailored to your experience level and goals.",
    icon: "route",
    accent: "bg-primary",
    stats: "3x faster career progression",
  },
  {
    title: "Career AI Copilot",
    description:
      "Chat with an AI that knows your profile. Get instant answers on resume improvements, interview prep, salary negotiation, and learning paths.",
    icon: "smart_toy",
    accent: "bg-tertiary",
    stats: "Available 24/7 with full context",
  },
  {
    title: "Mock Interview Simulator",
    description:
      "Practice real interview questions for your target role with AI evaluation, detailed feedback, and scoring — from technical to behavioral rounds.",
    icon: "mic",
    accent: "bg-primary",
    stats: "94% user confidence improvement",
  },
  {
    title: "Application Tracker",
    description:
      "Manage every job application in one kanban board. Track status from applied to offer, set reminders, and see your pipeline at a glance.",
    icon: "checklist",
    accent: "bg-tertiary",
    stats: "Never miss a follow-up again",
  },
];

const MOCK_SKILLS = ["React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"];
const MOCK_GAPS = [
  { name: "Docker", demand: 92, priority: "critical" },
  { name: "Redis", demand: 85, priority: "high" },
  { name: "AWS", demand: 89, priority: "high" },
  { name: "Kubernetes", demand: 76, priority: "medium" },
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-gutter max-w-container-max mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full text-on-primary-fixed text-label-sm font-label-sm mb-6">
          <span className="material-symbols-outlined text-[18px]">play_circle</span>
          Interactive Product Demo
        </div>
        <h1 className="font-display-xl text-display-xl leading-tight mb-6">
          See SkillGap AI <span className="italic text-primary">in action.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Follow along as we analyze a real developer profile and generate a personalized career roadmap in under 2 minutes.
        </p>
        <Link
          href="/sign-up"
          className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-label-md text-label-md hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <span className="material-symbols-outlined">analytics</span>
          Try it with your profile
        </Link>
      </section>

      {/* Mock Profile Analysis */}
      <section className="py-20 px-gutter max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-4">
            Step 1: Profile Detection
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto font-body-md text-body-md">
            Upload a resume or paste your GitHub username. Within seconds, our AI maps your entire skill profile.
          </p>
        </div>

        <div className="glass-card rounded-[32px] p-8 shadow-lg max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <div className="size-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
              A
            </div>
            <div>
              <p className="font-bold text-body-md">Arjun Sharma</p>
              <p className="text-label-sm text-on-surface-variant">Full Stack Developer • 3 years exp</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-label-sm text-primary font-bold">AI Analyzing...</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase text-on-surface-variant mb-3">Detected Skills</p>
              <div className="flex flex-wrap gap-2">
                {MOCK_SKILLS.map((s) => (
                  <span key={s} className="px-3 py-1.5 bg-primary-fixed/40 text-primary rounded-full text-label-sm font-bold border border-primary/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase text-on-surface-variant mb-3">Career Score</p>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full border-4 border-primary/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 border-t-4 border-primary rounded-full animate-spin [animation-duration:3s]" />
                  <span className="font-bold text-primary text-lg">72</span>
                </div>
                <div>
                  <p className="font-bold text-label-md">ADVANCED</p>
                  <p className="text-[11px] text-on-surface-variant">Career Readiness</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mock Gap Analysis */}
      <section className="py-20 bg-surface-container-low px-gutter">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg font-bold mb-4">
              Step 2: Skill Gap Detection
            </h2>
            <p className="text-on-surface-variant max-w-lg mx-auto font-body-md text-body-md">
              We analyze hundreds of live job postings and identify exactly what&apos;s stopping you from getting interviews.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {MOCK_GAPS.map((gap) => (
              <div key={gap.name} className="rounded-[20px] bg-white p-6 shadow-sm border border-outline-variant/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`size-2.5 rounded-full ${gap.priority === "critical" ? "bg-error" : gap.priority === "high" ? "bg-tertiary" : "bg-primary"}`} />
                    <h5 className="font-bold text-body-md">{gap.name}</h5>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${gap.priority === "critical" ? "bg-error/10 text-error" : gap.priority === "high" ? "bg-tertiary/10 text-tertiary" : "bg-primary/10 text-primary"}`}>
                      {gap.priority}
                    </span>
                  </div>
                  <span className="font-bold text-primary">{gap.demand}% demand</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full" style={{ width: `${gap.demand}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-gutter max-w-container-max mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-4">
            Everything you need to get hired
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DEMO_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-shadow"
            >
              <div className={`size-12 rounded-2xl ${feature.accent}/10 flex items-center justify-center mb-4`}>
                <span className={`material-symbols-outlined text-[24px] ${feature.accent === "bg-primary" ? "text-primary" : "text-tertiary"}`}>
                  {feature.icon}
                </span>
              </div>
              <h3 className="font-bold text-body-md mb-2">{feature.title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">
                {feature.description}
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high rounded-full">
                <span className="size-1.5 rounded-full bg-primary" />
                <span className="text-[11px] font-bold text-on-surface-variant">{feature.stats}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-gutter">
        <div className="max-w-3xl mx-auto text-center glass-card rounded-[40px] p-16 shadow-xl">
          <h2 className="font-display-lg text-display-lg font-bold mb-4">
            Ready to close the gap?
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto">
            Join thousands of engineers who used SkillGap AI to land their dream roles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-primary text-white rounded-full font-label-md text-label-md inline-flex items-center gap-2 hover:shadow-xl hover:-translate-y-1 transition-all"
            >
              <span className="material-symbols-outlined">analytics</span>
              Start free analysis
            </Link>
            <Link
              href="/#features"
              className="px-8 py-4 bg-white/50 backdrop-blur border border-outline-variant/30 rounded-full font-label-md text-label-md inline-flex items-center gap-2 hover:bg-white transition-all"
            >
              Learn more
            </Link>
          </div>
          <p className="mt-6 text-label-sm text-on-surface-variant/60">
            Free analysis • No credit card required
          </p>
        </div>
      </section>
    </div>
  );
}
