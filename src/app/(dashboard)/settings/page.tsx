export const dynamic = 'force-dynamic';

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — SkillGap AI",
  description: "Configure your notifications, integrations, and preferences.",
};

import { getOrCreateUser } from "@/lib/auth";
import { DashboardHeader } from "@/components/dashboard/header";

export default async function SettingsPage() {
  const user = await getOrCreateUser();

  return (
    <>
      <DashboardHeader
        title="Settings"
        subtitle="Manage your account preferences and notification settings."
      />

      <div className="max-w-2xl space-y-6">
        <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h4 className="font-bold text-body-md mb-4">Profile</h4>
          <div className="space-y-3">
            <div>
              <p className="text-label-sm text-on-surface-variant">Name</p>
              <p className="font-label-md">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <p className="text-label-sm text-on-surface-variant">Email</p>
              <p className="font-label-md">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h4 className="font-bold text-body-md mb-4">Notifications</h4>
          <div className="space-y-3">
            {["Email notifications", "Weekly digest", "Job match alerts", "Roadmap reminders"].map((item) => (
              <label key={item} className="flex items-center justify-between cursor-pointer py-1">
                <span className="font-body-md text-body-md select-none">{item}</span>
                <div className="relative">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-6 bg-surface-container-highest rounded-full peer peer-checked:bg-primary transition-colors duration-200" />
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h4 className="font-bold text-body-md mb-4">Integrations</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="font-body-md">GitHub</span>
              <span className="text-label-sm text-primary">Connected</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="font-body-md">Google</span>
              <span className="text-label-sm text-on-surface-variant">Via Clerk</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
