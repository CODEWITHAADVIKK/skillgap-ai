"use client";

import { useState, useTransition } from "react";
import { DashboardHeader } from "@/components/dashboard/header";
import { createApplication, updateApplicationStatus } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";

interface Application {
  id: string;
  company: string;
  role: string;
  status: string;
  applicationDate: Date;
  notes: string | null;
}

const COLUMNS = [
  { id: "applied", label: "Applied" },
  { id: "assessment", label: "Assessment" },
  { id: "interview", label: "Interview" },
  { id: "offer", label: "Offer" },
  { id: "rejected", label: "Rejected" },
];

export default function ApplicationsClient({ applications: initial }: { applications: Application[] }) {
  const [applications, setApplications] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const app = await createApplication({ company, role });
      setApplications((prev) => [...prev, app as Application]);
      setCompany("");
      setRole("");
      setShowForm(false);
    });
  }

  function handleDrag(appId: string, newStatus: string) {
    startTransition(async () => {
      await updateApplicationStatus(appId, newStatus);
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
      );
    });
  }

  return (
    <>
      <DashboardHeader
        title="Application Tracker"
        subtitle="Track your job applications across every stage of the hiring process."
      />

      <div className="mb-6">
        <Button onClick={() => setShowForm(!showForm)}>Add Application</Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 mb-6 flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-label-sm text-on-surface-variant">Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} required className="mt-1 w-full rounded-xl border border-outline-variant/30 px-4 py-2 outline-none focus:border-primary" />
          </div>
          <div className="flex-1">
            <label className="text-label-sm text-on-surface-variant">Role</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} required className="mt-1 w-full rounded-xl border border-outline-variant/30 px-4 py-2 outline-none focus:border-primary" />
          </div>
          <Button type="submit" disabled={isPending}>Save</Button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5 overflow-x-auto">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[200px]">
            <h4 className="font-label-md text-label-md font-bold mb-3 text-on-surface-variant uppercase">{col.label}</h4>
            <div className="space-y-3 min-h-[200px] rounded-2xl bg-surface-container-low/50 p-3">
              {applications
                .filter((a) => a.status === col.id)
                .map((app) => (
                  <div key={app.id} className="rounded-xl bg-white p-4 shadow-sm border border-outline-variant/10">
                    <p className="font-label-md font-bold">{app.company}</p>
                    <p className="text-label-sm text-on-surface-variant">{app.role}</p>
                    <p className="text-[10px] text-on-surface-variant mt-2">
                      {new Date(app.applicationDate).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {COLUMNS.filter((c) => c.id !== app.status).slice(0, 3).map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => handleDrag(app.id, c.id)}
                          className="text-[10px] px-2 py-0.5 bg-surface-container-high rounded-full hover:bg-primary/10"
                        >
                          → {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
