"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import {
  connectGitHub,
  generateAIProfile,
  updateOnboardingStep,
  uploadResume,
} from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

const DREAM_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Engineer",
  "AI Engineer",
  "Data Scientist",
  "Cloud Engineer",
];

const EXPERIENCE_LEVELS = ["Intern", "Junior", "Mid-Level", "Senior", "Lead"];

const STEPS = [
  "Choose Dream Role",
  "Location & Experience",
  "Upload Resume",
  "Connect GitHub",
  "Generate AI Profile",
];

export default function OnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStep = parseInt(searchParams.get("step") ?? "1", 10);
  const [step, setStep] = useState(Math.min(Math.max(initialStep, 1), 5));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [dreamRole, setDreamRole] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [remote, setRemote] = useState(false);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [analysisResult, setAnalysisResult] = useState<Record<string, unknown> | null>(null);

  function nextStep() {
    setStep((s) => Math.min(s + 1, 5));
    setError(null);
  }

  function handleStep1() {
    if (!dreamRole) {
      setError("Please select a dream role");
      return;
    }
    startTransition(async () => {
      await updateOnboardingStep({ step: 2, dreamRole });
      nextStep();
    });
  }

  function handleStep2() {
    startTransition(async () => {
      await updateOnboardingStep({
        step: 3,
        country,
        city,
        remote,
        expectedSalary: expectedSalary ? parseInt(expectedSalary, 10) : undefined,
        experienceLevel,
      });
      nextStep();
    });
  }

  function handleStep3(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await uploadResume(formData);
        nextStep();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    });
  }

  function handleStep4() {
    if (!githubUsername) {
      setError("Please enter your GitHub username");
      return;
    }
    startTransition(async () => {
      try {
        await connectGitHub(githubUsername);
        nextStep();
      } catch (err) {
        setError(err instanceof Error ? err.message : "GitHub connection failed");
      }
    });
  }

  function handleStep5() {
    startTransition(async () => {
      try {
        const result = await generateAIProfile();
        setAnalysisResult(result.result as unknown as Record<string, unknown>);
        setTimeout(() => router.push("/dashboard"), 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Analysis failed");
      }
    });
  }

  return (
    <div className="min-h-screen bg-surface px-gutter py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="font-headline-md text-headline-md font-bold text-primary">
          SkillGap AI
        </Link>

        <div className="mt-8 mb-8">
          <div className="flex gap-2">
            {STEPS.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1.5 rounded-full transition-colors ${
                    i + 1 <= step ? "bg-primary" : "bg-surface-container-high"
                  }`}
                />
                <p
                  className={`mt-2 font-label-sm text-label-sm ${
                    i + 1 === step ? "text-primary" : "text-on-surface-variant"
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[32px] p-8 shadow-lg">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md font-bold">Choose Your Dream Role</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Select the role you want SkillGap AI to optimize your career for.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {DREAM_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setDreamRole(role)}
                    className={`rounded-2xl border p-4 text-left font-label-md transition-all ${
                      dreamRole === role
                        ? "border-primary bg-primary-fixed/30 text-primary"
                        : "border-outline-variant/20 hover:border-primary/30"
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
              <Button onClick={handleStep1} disabled={isPending} className="w-full rounded-full">
                Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md font-bold">Location & Experience</h2>
              <div className="space-y-4">
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant">Country</label>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-outline-variant/30 px-4 py-3 outline-none focus:border-primary"
                    placeholder="United States"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant">City</label>
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-outline-variant/30 px-4 py-3 outline-none focus:border-primary"
                    placeholder="San Francisco"
                  />
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} />
                  <span className="font-body-md text-body-md">Open to remote work</span>
                </label>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant">Expected Salary (USD)</label>
                  <input
                    type="number"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-outline-variant/30 px-4 py-3 outline-none focus:border-primary"
                    placeholder="120000"
                  />
                </div>
                <div>
                  <label className="font-label-md text-label-md text-on-surface-variant">Experience Level</label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`rounded-full px-4 py-2 font-label-sm ${
                          experienceLevel === level
                            ? "bg-primary text-white"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <Button onClick={handleStep2} disabled={isPending} className="w-full rounded-full">
                Continue
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md font-bold">Upload Your Resume</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Upload PDF or DOCX. We&apos;ll extract skills, experience, and projects.
              </p>
              <form onSubmit={handleStep3} className="space-y-4">
                <div className="rounded-2xl border-2 border-dashed border-outline-variant/30 p-12 text-center">
                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                    className="mx-auto block"
                  />
                  <p className="mt-4 font-label-sm text-label-sm text-on-surface-variant">
                    PDF or DOCX, max 10MB
                  </p>
                </div>
                <Button type="submit" disabled={isPending} className="w-full rounded-full">
                  {isPending ? "Parsing resume..." : "Upload & Continue"}
                </Button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md font-bold">Connect GitHub</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Enter your GitHub username to analyze repositories, languages, and project complexity.
              </p>
              <input
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                className="w-full rounded-xl border border-outline-variant/30 px-4 py-3 outline-none focus:border-primary"
                placeholder="your-github-username"
              />
              <Button onClick={handleStep4} disabled={isPending} className="w-full rounded-full">
                {isPending ? "Analyzing GitHub..." : "Connect & Analyze"}
              </Button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center">
              <h2 className="font-headline-md text-headline-md font-bold">Generate AI Profile</h2>
              {!analysisResult ? (
                <>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    We&apos;ll analyze your resume, GitHub, and live job market data to build your personalized career intelligence profile.
                  </p>
                  <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-primary/10 relative">
                    <div className="absolute inset-0 animate-spin rounded-full border-t-8 border-primary [animation-duration:3s]" />
                    <span className="material-symbols-outlined text-4xl text-primary">auto_awesome</span>
                  </div>
                  <Button onClick={handleStep5} disabled={isPending} className="w-full rounded-full">
                    {isPending ? "Generating..." : "Generate My Profile"}
                  </Button>
                </>
              ) : (
                <div className="shimmer-effect rounded-2xl bg-primary-fixed/20 p-6">
                  <p className="font-headline-md text-headline-md font-bold text-primary">
                    Career Readiness: {String(analysisResult.careerReadinessScore)}%
                  </p>
                  <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                    Redirecting to your dashboard...
                  </p>
                </div>
              )}
            </div>
          )}

          {error && <p className="mt-4 font-label-sm text-label-sm text-error">{error}</p>}
        </div>
      </div>
    </div>
  );
}
