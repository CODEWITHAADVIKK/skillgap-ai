export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — SkillGap AI",
  description: "Your personalized career intelligence dashboard.",
};

import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  TrendingUp,
  Shield,
  ChevronRight,
  Zap,
} from "lucide-react";
import { getDashboardData } from "@/lib/data/dashboard";
import { CareerReadinessRing } from "@/components/dashboard/career-readiness-ring";
import { GithubPulseChart } from "@/components/dashboard/github-pulse-chart";
import { GrowthMomentumChart } from "@/components/dashboard/growth-momentum-chart";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data.profile.onboardingComplete) {
    redirect("/onboarding");
  }

  const greeting = getGreeting();
  const firstName = data.firstName ?? "there";
  const goalPercent = Math.round(
    (data.profile.weeklyProgressHours / Math.max(data.profile.weeklyGoalHours, 1)) * 100
  );

  return (
    <div className="space-y-6">
      {/* ── Hero Card ───────────────────────────────────────────────── */}
      <div className="rounded-[28px] bg-white p-8 shadow-sm border border-outline-variant/10 relative overflow-hidden">
        {/* Top-right badges */}
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-bold text-primary">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            AI Live
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary-fixed px-3 py-1 text-[11px] font-bold text-on-tertiary-fixed">
            🔥 {data.streak ?? 7} Day Streak
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-2">
          {`${greeting}, ${firstName}.`}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mb-6">
          {data.heroMessage ??
            `Today's outlook is promising. Your recent projects have boosted your profile visibility. To hit your "${data.profile.dreamRole}" target, let's focus on cloud architecture today.`}
        </p>

        {/* Daily goal progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
              TODAY&apos;S GOAL: {data.todayGoal ?? "API OPTIMIZATION"}
            </span>
            <span className="text-[11px] font-bold text-primary">
              {goalPercent}% Completed
            </span>
          </div>
          <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(goalPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Main Grid Row 1 ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Career Readiness */}
        <div className="lg:col-span-4 rounded-[28px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h3 className="font-bold text-body-md mb-4">Career Readiness</h3>
          <div className="flex justify-center mb-4">
            <CareerReadinessRing
              score={data.profile.careerReadinessScore}
              resumeScore={data.profile.resumeHealth}
              projectScore={Math.round(data.profile.resumeHealth * 0.8)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="text-center">
              <p className="text-[11px] text-on-surface-variant mb-1">Resume</p>
              <p className="font-bold text-primary text-label-md">{data.profile.resumeHealth}%</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-on-surface-variant mb-1">Projects</p>
              <p className="font-bold text-primary text-label-md">
                {Math.round(data.profile.resumeHealth * 0.8)}%
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
            <Shield className="size-3.5 text-primary" />
            <span className="text-[11px] font-bold text-primary">High Confidence Match</span>
          </div>
        </div>

        {/* ATS Score + GitHub Pulse column */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* ATS Score Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[28px] bg-white p-6 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">description</span>
                </div>
                <span className="text-[11px] font-bold text-on-surface-variant">
                  ATS SCORE: {data.profile.atsScore}
                </span>
              </div>
              <h4 className="font-bold text-body-md mb-1">Resume Health</h4>
              <p className="text-[12px] text-on-surface-variant mb-4">
                {data.atsMissingKeywords ?? "3 critical keywords missing for your target roles."}
              </p>
              <Link
                href="/gap-analysis"
                className="inline-flex items-center gap-1 text-primary text-[13px] font-bold hover:underline"
              >
                Improve Resume <ArrowRight className="size-3.5" />
              </Link>
            </div>

            {/* GitHub Pulse */}
            <div className="rounded-[28px] bg-white p-6 shadow-sm border border-outline-variant/10">
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 rounded-xl bg-on-surface/90 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">code</span>
                </div>
                <span className="text-[11px] font-bold text-primary">
                  Quality Score A+
                </span>
              </div>
              <h4 className="font-bold text-body-md mb-1">GitHub Pulse</h4>
              <div className="my-2">
                <GithubPulseChart health={data.profile.githubHealth} />
              </div>
              <p className="text-[12px] text-on-surface-variant">
                Active development detected in{" "}
                {data.activeRepos ?? 4} repos.
              </p>
            </div>
          </div>

          {/* Recommended Next Steps */}
          <div className="rounded-[28px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <h4 className="font-bold text-body-md mb-4">Recommended Next Steps</h4>
            <div className="space-y-3">
              {(data.nextSteps ?? [
                {
                  title: "Finish Kubernetes Certification",
                  subtitle: "Estimated 4 hours remaining to mastery.",
                  icon: "school",
                },
                {
                  title: "Update LinkedIn Project Section",
                  subtitle: "Your new project is ready to showcase.",
                  icon: "share",
                },
              ]).map((step: { title: string; subtitle: string; icon?: string }, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-2xl border border-outline-variant/10 p-4 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        {step.icon ?? "arrow_forward"}
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-label-md font-bold">{step.title}</p>
                      <p className="text-[12px] text-on-surface-variant">{step.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-5 text-on-surface-variant" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Project + Growth Momentum ────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Featured Project */}
        {data.featuredProject && (
          <div className="rounded-[28px] bg-white overflow-hidden shadow-sm border border-outline-variant/10">
            {/* Project preview banner */}
            <div className="h-40 bg-gradient-to-br from-surface-container-high to-surface-container relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-1 opacity-20">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="h-1 rounded-full bg-primary" style={{ width: `${20 + ((i * 17) % 61)}px` }} />
                  ))}
                </div>
              </div>
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-2.5 py-1 bg-on-surface/80 text-white rounded-full text-[10px] font-bold uppercase">
                  {data.featuredProject.difficulty}
                </span>
                <span className="px-2.5 py-1 bg-on-surface/80 text-white rounded-full text-[10px] font-bold uppercase">
                  {data.featuredProject.duration}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h4 className="font-bold text-headline-md mb-1 leading-tight">
                {data.featuredProject.title}
              </h4>
              <p className="text-[13px] text-on-surface-variant mb-4 line-clamp-2">
                {data.featuredProject.description}
              </p>
              <Link
                href="/projects"
                className="w-full flex items-center justify-center gap-2 rounded-full bg-on-surface text-white py-3 font-label-md text-label-md hover:opacity-90 transition-opacity"
              >
                <Zap className="size-4" />
                Start Project
              </Link>
            </div>
          </div>
        )}

        {/* Growth Momentum */}
        <div className="rounded-[28px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-body-md">Growth Momentum</h4>
              <p className="text-[12px] text-primary font-bold flex items-center gap-1 mt-0.5">
                <TrendingUp className="size-3.5" />
                Trending +14% vs last week
              </p>
            </div>
            <span className="text-[10px] font-bold text-on-surface-variant uppercase">Peak</span>
          </div>
          <GrowthMomentumChart trends={data.marketTrends} />
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-outline-variant/10">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-tertiary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-on-tertiary-fixed text-[16px]">local_fire_department</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Learning Streak</p>
                <p className="font-bold text-label-md">{data.profile.weeklyProgressHours * 4} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-xl bg-primary-fixed/50 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[16px]">event</span>
              </div>
              <div>
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Next Deadline</p>
                <p className="font-bold text-label-md">In {data.nextDeadlineDays ?? 2}d</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
