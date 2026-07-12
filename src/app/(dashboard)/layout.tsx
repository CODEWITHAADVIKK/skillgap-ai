import { CareerCopilot } from "@/components/dashboard/career-copilot";
import { DashboardFooter } from "@/components/dashboard/footer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <main className="flex-1 px-8 py-8">{children}</main>
          <DashboardFooter />
        </div>
        <CareerCopilot />
      </div>
    </AuthGuard>
  );
}
