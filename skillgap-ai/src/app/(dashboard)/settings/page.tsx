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
              <label key={item} className="flex items-center justify-between">
                <span className="font-body-md text-body-md">{item}</span>
                <input type="checkbox" defaultChecked className="size-4 accent-primary" />
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
