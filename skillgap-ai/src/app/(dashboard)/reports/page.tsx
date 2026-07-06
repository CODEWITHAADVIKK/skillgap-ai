import { getReportsData } from "@/lib/data/dashboard";
import ReportsClient from "./reports-client";

export default async function ReportsPage() {
  const reports = await getReportsData();
  return <ReportsClient reports={reports} />;
}
