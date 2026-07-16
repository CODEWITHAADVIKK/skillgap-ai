export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports — SkillGap AI",
  description: "View and download your AI-generated career intelligence reports.",
};

import { getReportsData } from "@/lib/data/dashboard";
import ReportsClient from "./reports-client";

export default async function ReportsPage() {
  const reports = await getReportsData();
  return <ReportsClient reports={reports} />;
}
