"use client";

import { useState, useTransition } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { generateReport } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

interface Report {
  id: string;
  title: string;
  type: string;
  createdAt: Date;
  pdfUrl: string | null;
  userId: string;
  data: unknown;
}

const REPORT_TYPES = [
  {
    id: "career",
    title: "Career Intelligence Report",
    description: "Full analysis: career readiness, skill gaps, market position, and roadmap summary.",
    icon: "insights",
    accent: "bg-primary",
  },
  {
    id: "skills",
    title: "Skill Gap Report",
    description: "Detailed breakdown of missing skills ranked by market demand and priority.",
    icon: "radar",
    accent: "bg-tertiary",
  },
  {
    id: "github",
    title: "GitHub Portfolio Report",
    description: "Repository quality scores, language distribution, and contribution analysis.",
    icon: "code",
    accent: "bg-primary",
  },
];


export default function ReportsClient({ reports: initial }: { reports: Report[] }) {
  const [reports, setReports] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [generatingType, setGeneratingType] = useState<string | null>(null);

  function handleGenerate(type: string) {
    setGeneratingType(type);
    startTransition(async () => {
      try {
        const newReport = await generateReport(type);
        setReports((prev) => [newReport as unknown as Report, ...prev]);
      } catch {
        // error handled silently
      } finally {
        setGeneratingType(null);
      }
    });
  }

  async function handleDownload(report: Report) {
    setDownloadingId(report.id);
    try {
      const res = await fetch(`/api/reports/${report.id}/download`);
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skillgap-report-${report.id.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(`/api/reports/${report.id}/download`, "_blank");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <>
      <DashboardHeader
        title="Career Reports"
        subtitle="Generate downloadable PDF reports with full career analysis, skill gaps, and roadmap summaries."
      />

      {/* Generate Report Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-10">
        {REPORT_TYPES.map((rt) => (
          <div
            key={rt.id}
            className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 hover:shadow-md transition-all"
          >
            <div className={`size-12 ${rt.accent}/10 rounded-2xl flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined text-[24px] ${rt.accent === "bg-primary" ? "text-primary" : "text-tertiary"}`}>
                {rt.icon}
              </span>
            </div>
            <h4 className="font-bold text-body-md mb-2">{rt.title}</h4>
            <p className="text-[12px] text-on-surface-variant mb-6 flex-1">{rt.description}</p>
            <Button
              onClick={() => handleGenerate(rt.id)}
              disabled={isPending && generatingType === rt.id}
              className="w-full rounded-full"
              variant={rt.accent === "bg-tertiary" ? "outline" : "default"}
            >
              {isPending && generatingType === rt.id ? (
                <>
                  <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">download</span>
                  Generate PDF
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Past Reports */}
      {reports.length > 0 && (
        <div>
          <h4 className="font-bold text-body-md mb-4">Your Reports</h4>
          <div className="space-y-3">
            {reports.map((report) => {
              return (
                <div
                  key={report.id}
                  className="rounded-[20px] bg-white p-5 shadow-sm border border-outline-variant/10 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">description</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-label-md truncate">{report.title}</p>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">
                        {new Date(report.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full bg-primary/10 text-primary`}>
                      Ready
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(report)}
                      disabled={downloadingId === report.id}
                      className="rounded-full"
                    >
                      {downloadingId === report.id ? (
                        <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {reports.length === 0 && (
        <div className="text-center py-16">
          <div className="size-16 rounded-2xl bg-surface-container-high flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">description</span>
          </div>
          <p className="font-bold text-label-md mb-2">No reports yet</p>
          <p className="text-[13px] text-on-surface-variant">Generate your first career intelligence report above.</p>
        </div>
      )}
    </>
  );
}
