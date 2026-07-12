"use client";

import { useState, useTransition } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { startInterviewSession, submitInterviewAnswer } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  type: string;
  company: string | null;
  role: string | null;
  score: number | null;
  questions: unknown;
  createdAt: Date;
}

interface AIEvaluation {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
  keyPoints: string[];
  confidence: number;
}

const SESSION_TYPES = [
  {
    id: "technical",
    label: "Technical Round",
    description: "Data structures, algorithms, system design",
    icon: "code",
    accent: "bg-primary",
  },
  {
    id: "behavioral",
    label: "Behavioral Round",
    description: "STAR method, leadership, teamwork",
    icon: "psychology",
    accent: "bg-tertiary",
  },
  {
    id: "hr",
    label: "HR Round",
    description: "Culture fit, salary, career goals",
    icon: "handshake",
    accent: "bg-primary",
  },
  {
    id: "company",
    label: "Company-Specific",
    description: "Role-specific deep dives",
    icon: "corporate_fare",
    accent: "bg-tertiary",
  },
];

const GRADE_CONFIG = {
  A: { color: "text-primary", bg: "bg-primary/10", label: "Excellent" },
  B: { color: "text-tertiary", bg: "bg-tertiary/10", label: "Good" },
  C: { color: "text-on-surface", bg: "bg-surface-container-high", label: "Average" },
  D: { color: "text-error", bg: "bg-error/10", label: "Needs Work" },
  F: { color: "text-error", bg: "bg-error/10", label: "Poor" },
};

export default function InterviewPrepClient({ sessions }: { sessions: Session[] }) {
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{
    score: number;
    feedback: { overall: string; suggestions: string[] };
    weakTopics: string[];
  } | null>(null);
  const [aiEvals, setAiEvals] = useState<Record<string, AIEvaluation>>({});
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [evalLoading, setEvalLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleStart(type: string) {
    startTransition(async () => {
      const session = await startInterviewSession(type);
      setActiveSession(session as Session);
      setAnswers({});
      setResult(null);
      setAiEvals({});
      setCurrentQIndex(0);
    });
  }

  async function evaluateAnswer(question: string, answer: string, category: string, questionId: string) {
    if (!answer.trim() || evalLoading) return;
    setEvalLoading(true);
    try {
      const res = await fetch("/api/interview/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          role: activeSession?.role ?? "Full Stack Engineer",
          category,
        }),
      });
      const data = (await res.json()) as AIEvaluation;
      setAiEvals((prev) => ({ ...prev, [questionId]: data }));
    } catch {
      // silent fail
    } finally {
      setEvalLoading(false);
    }
  }

  function handleSubmit() {
    if (!activeSession) return;
    startTransition(async () => {
      const res = await submitInterviewAnswer(activeSession.id, answers);
      setResult(res);
    });
  }

  const questions = activeSession
    ? (activeSession.questions as { id: string; question: string; category: string }[])
    : [];

  const currentQ = questions[currentQIndex];

  return (
    <>
      <DashboardHeader
        title="Interview Preparation"
        subtitle="AI-powered mock interviews with real-time scoring and personalized feedback."
      />

      {!activeSession ? (
        <>
          {/* Session Type Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {SESSION_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleStart(type.id)}
                disabled={isPending}
                className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 text-left hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className={`size-12 ${type.accent}/10 rounded-2xl flex items-center justify-center mb-4`}>
                  <span className={`material-symbols-outlined text-[24px] ${type.accent === "bg-primary" ? "text-primary" : "text-tertiary"}`}>
                    {type.icon}
                  </span>
                </div>
                <h3 className="font-bold text-body-md mb-1">{type.label}</h3>
                <p className="text-[12px] text-on-surface-variant">{type.description}</p>
              </button>
            ))}
          </div>

          {/* Past Sessions */}
          {sessions.length > 0 && (
            <div>
              <h4 className="font-bold text-body-md mb-4">Past Sessions</h4>
              <div className="space-y-3">
                {sessions.map((s) => {
                  const gradeKey = s.score
                    ? (s.score >= 90 ? "A" : s.score >= 80 ? "B" : s.score >= 70 ? "C" : s.score >= 60 ? "D" : "F")
                    : null;
                  const gradeCfg = gradeKey ? GRADE_CONFIG[gradeKey] : null;
                  return (
                    <div
                      key={s.id}
                      className="rounded-[20px] bg-white p-5 shadow-sm border border-outline-variant/10 flex justify-between items-center"
                    >
                      <div>
                        <p className="font-bold font-label-md capitalize">{s.type} Round — {s.role ?? "General"}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">
                          {new Date(s.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      {s.score != null && gradeCfg && (
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-headline-md text-primary">{s.score}</span>
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${gradeCfg.bg} ${gradeCfg.color}`}>
                            {gradeKey} — {gradeCfg.label}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Interview Panel */}
          <div className="lg:col-span-2">
            {!result ? (
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-outline-variant/10">
                {/* Progress indicator */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {questions.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setCurrentQIndex(i)}
                        className={`size-8 rounded-full font-bold text-label-sm transition-colors ${
                          i === currentQIndex
                            ? "bg-primary text-white"
                            : answers[questions[i]?.id]
                            ? "bg-primary/20 text-primary"
                            : "bg-surface-container-high text-on-surface-variant"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <span className="text-[12px] text-on-surface-variant">
                    {Object.keys(answers).length} / {questions.length} answered
                  </span>
                </div>

                {currentQ && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase font-bold px-2.5 py-1 bg-primary/10 text-primary rounded-full">
                        {currentQ.category}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Question {currentQIndex + 1} of {questions.length}</span>
                    </div>
                    <h4 className="font-bold text-headline-md leading-snug">{currentQ.question}</h4>

                    <textarea
                      value={answers[currentQ.id] ?? ""}
                      onChange={(e) => setAnswers({ ...answers, [currentQ.id]: e.target.value })}
                      className="w-full rounded-2xl border border-outline-variant/30 px-5 py-4 min-h-[160px] outline-none focus:border-primary font-body-md text-body-md resize-none transition-colors"
                      placeholder="Type your answer here... Be specific and use examples where possible."
                    />

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => evaluateAnswer(currentQ.question, answers[currentQ.id] ?? "", currentQ.category, currentQ.id)}
                        disabled={evalLoading || !answers[currentQ.id]?.trim()}
                      >
                        {evalLoading ? "Evaluating..." : "Get AI Feedback"}
                      </Button>

                      <div className="flex gap-2 ml-auto">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentQIndex(Math.max(0, currentQIndex - 1))}
                          disabled={currentQIndex === 0}
                        >
                          ← Previous
                        </Button>
                        {currentQIndex < questions.length - 1 ? (
                          <Button onClick={() => setCurrentQIndex(currentQIndex + 1)}>
                            Next →
                          </Button>
                        ) : (
                          <Button
                            onClick={handleSubmit}
                            disabled={isPending || Object.keys(answers).length < questions.length}
                          >
                            {isPending ? "Submitting..." : "Submit All"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Feedback for current question */}
                {currentQ && aiEvals[currentQ.id] && (
                  <div className="mt-6 pt-6 border-t border-outline-variant/10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="size-2 rounded-full bg-primary animate-pulse" />
                      <span className="font-bold text-label-md text-primary">AI Feedback</span>
                      <div className={`ml-auto px-3 py-1 rounded-full text-[11px] font-bold ${GRADE_CONFIG[aiEvals[currentQ.id].grade].bg} ${GRADE_CONFIG[aiEvals[currentQ.id].grade].color}`}>
                        Grade: {aiEvals[currentQ.id].grade} — {aiEvals[currentQ.id].score}/100
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-2">✅ Strengths</p>
                        <ul className="space-y-1">
                          {aiEvals[currentQ.id].strengths.map((s, i) => (
                            <li key={i} className="text-[12px] text-on-surface-variant flex items-start gap-1.5">
                              <span className="text-primary mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase text-on-surface-variant mb-2">⚡ Improvements</p>
                        <ul className="space-y-1">
                          {aiEvals[currentQ.id].improvements.map((s, i) => (
                            <li key={i} className="text-[12px] text-on-surface-variant flex items-start gap-1.5">
                              <span className="text-tertiary mt-0.5">•</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="mt-3 p-4 bg-primary-fixed/20 rounded-xl">
                      <p className="text-[11px] font-bold text-primary uppercase mb-1">Better Answer Framework</p>
                      <p className="text-[12px] text-on-surface-variant">{aiEvals[currentQ.id].betterAnswer}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Results Panel */
              <div className="rounded-[28px] bg-white p-8 shadow-sm border border-outline-variant/10">
                <div className="text-center mb-8">
                  <div className="size-24 rounded-full border-8 border-primary/20 flex items-center justify-center mx-auto mb-4 relative">
                    <div className="absolute inset-0 border-t-8 border-primary rounded-full" style={{ transform: `rotate(${result.score * 3.6}deg)` }} />
                    <span className="font-bold text-headline-md text-primary">{result.score}</span>
                  </div>
                  <h3 className="font-bold text-headline-lg mb-2">Session Complete!</h3>
                  <p className="text-on-surface-variant font-body-md">{result.feedback.overall}</p>
                </div>

                {result.feedback.suggestions.length > 0 && (
                  <div className="mb-6">
                    <p className="font-bold text-label-md mb-3">Areas to Improve:</p>
                    <ul className="space-y-2">
                      {result.feedback.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[13px] text-on-surface-variant">
                          <span className="text-primary mt-0.5 font-bold">→</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.weakTopics.length > 0 && (
                  <div className="mb-6 p-4 bg-error/5 rounded-2xl border border-error/15">
                    <p className="text-[11px] font-bold text-error uppercase mb-1">Focus Topics</p>
                    <p className="text-[13px] text-on-surface-variant">{result.weakTopics.join(", ")}</p>
                  </div>
                )}

                <Button
                  className="w-full rounded-full"
                  onClick={() => { setActiveSession(null); setResult(null); setAiEvals({}); }}
                >
                  Start New Session
                </Button>
              </div>
            )}
          </div>

          {/* Tips Sidebar */}
          <div className="space-y-4">
            <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
              <h4 className="font-bold text-label-md mb-4">Interview Tips</h4>
              <ul className="space-y-3">
                {[
                  "Use the STAR method for behavioral questions",
                  "Be specific — use real numbers and outcomes",
                  "Think aloud for technical questions",
                  "Ask clarifying questions when needed",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] text-on-surface-variant">
                    <span className="size-5 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              variant="outline"
              className="w-full rounded-2xl"
              onClick={() => setActiveSession(null)}
            >
              ← Back to Sessions
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
