import { CareerCopilot } from "@/components/dashboard/career-copilot";
import { DashboardFooter } from "@/components/dashboard/footer";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MobileHeader } from "@/components/dashboard/mobile-header";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col lg:flex-row bg-[#F9FAFB]">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileHeader />
          <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
          <DashboardFooter />
        </div>
        <CareerCopilot />
      </div>
    </AuthGuard>
  );
}
