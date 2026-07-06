import { getApplicationsData } from "@/lib/data/dashboard";
import ApplicationsClient from "./applications-client";

export default async function ApplicationsPage() {
  const applications = await getApplicationsData();
  return <ApplicationsClient applications={applications} />;
}
