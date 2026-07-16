export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications — SkillGap AI",
  description: "Track your active job applications and pipelines.",
};

import { getApplicationsData } from "@/lib/data/dashboard";
import ApplicationsClient from "./applications-client";

export default async function ApplicationsPage() {
  const applications = await getApplicationsData();
  return <ApplicationsClient applications={applications} />;
}
