import { getInterviewSessions } from "@/lib/data/dashboard";
import InterviewPrepClient from "./interview-client";

export default async function InterviewPrepPage() {
  const sessions = await getInterviewSessions();
  return <InterviewPrepClient sessions={sessions} />;
}
