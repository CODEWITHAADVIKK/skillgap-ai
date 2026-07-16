export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interview Prep — SkillGap AI",
  description: "Practice technical and behavioral interview questions with real-time AI scoring.",
};

import { getInterviewSessions } from "@/lib/data/dashboard";
import InterviewPrepClient from "./interview-client";

export default async function InterviewPrepPage() {
  const sessions = await getInterviewSessions();
  return <InterviewPrepClient sessions={sessions} />;
}
