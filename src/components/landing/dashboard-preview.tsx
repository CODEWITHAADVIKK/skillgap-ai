import {
  LayoutDashboard,
  LineChart,
  FolderKanban,
  RefreshCw,
  Database,
  FileText,
  FileCheck,
} from "lucide-react";

export function DashboardPreview() {
  return (
    <section className="py-12 md:py-20 w-full max-w-7xl mx-auto px-6">
      <div className="mb-stack-lg space-y-4">
        <span className="px-4 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-label-sm font-label-sm">
          Dashboard Ecosystem
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">
          Your career command center.
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Track your progress, analyze real-world market gaps, and build the
          specific skills that recruiters are hunting for right now.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto lg:h-[700px]">
        <div className="md:col-span-8 glass-card rounded-[32px] overflow-hidden flex flex-col p-0 shadow-lg group">
          <div className="bg-surface-container-low/50 px-8 py-6 border-b border-outline-variant/10 flex justify-between items-center">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-error/20"></div>
              <div className="w-3 h-3 rounded-full bg-tertiary/20"></div>
              <div className="w-3 h-3 rounded-full bg-primary/20"></div>
            </div>
            <div className="bg-white/80 rounded-lg px-4 py-1.5 text-label-sm border border-outline-variant/10">
              skillgap.ai/dashboard
            </div>
          </div>
          <div className="flex-grow p-8 flex flex-col lg:flex-row gap-8">
            <div className="lg:w-48 space-y-6">
              <div className="space-y-3">
                <div className="h-10 bg-primary/10 rounded-xl flex items-center px-4 gap-3 text-primary">
                  <LayoutDashboard className="size-5 shrink-0" />
                  <span className="font-label-sm font-semibold">Overview</span>
                </div>
                <div className="h-10 hover:bg-surface-container-high rounded-xl flex items-center px-4 gap-3 text-on-surface-variant transition-colors cursor-pointer">
                  <LineChart className="size-5 shrink-0" />
                  <span className="font-label-sm">Analysis</span>
                </div>
                <div className="h-10 hover:bg-surface-container-high rounded-xl flex items-center px-4 gap-3 text-on-surface-variant transition-colors cursor-pointer">
                  <FolderKanban className="size-5 shrink-0" />
                  <span className="font-label-sm">Projects</span>
                </div>
              </div>
              <div className="pt-10">
                <div className="p-4 bg-primary-container text-white rounded-2xl relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                  <p className="text-[11px] font-bold uppercase tracking-wider mb-2">
                    Pro Tip
                  </p>
                  <p className="text-label-sm leading-snug">
                    Connect GitHub to see code quality metrics.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-surface-container-low/30 rounded-2xl border border-outline-variant/10 p-6 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="font-bold text-body-md text-on-surface">Career Match Score</h4>
                  <p className="text-[12px] text-on-surface-variant mt-1">
                    Based on your profile vs. Mid-level Full Stack role
                  </p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-label-sm font-bold">
                  84% Match
                </span>
              </div>
              <div className="flex-1 flex items-center justify-center relative py-6">
                {/* SVG Radial Graph Mockup */}
                <div className="relative size-36 flex items-center justify-center">
                  <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-surface-container-high"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary"
                      strokeDasharray="84, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-headline-md font-bold text-on-surface">84</span>
                    <span className="text-[10px] text-on-surface-variant uppercase font-semibold">Ready</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 border-t border-outline-variant/10 pt-4 mt-4">
                <div className="flex-1 text-center border-r border-outline-variant/10">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Critical Gaps</p>
                  <p className="font-bold text-primary text-label-md mt-1">2 Gaps</p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Hiring Level</p>
                  <p className="font-bold text-tertiary text-label-md mt-1">L4 / Mid</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-grow glass-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
              <RefreshCw className="size-6" />
            </div>
            <h3 className="text-headline-md font-bold text-on-surface">Live Sync</h3>
            <p className="text-on-surface-variant">
              We monitor thousands of job postings daily to ensure your career
              roadmap is always based on the latest industry demands.
            </p>
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
              <Database className="size-36 text-on-surface" />
            </div>
          </div>
          <div className="flex-grow glass-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group bg-primary-fixed/30">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <FileText className="size-6" />
            </div>
            <h3 className="text-headline-md font-bold text-on-surface">Smart Resume</h3>
            <p className="text-on-surface-variant">
              Our AI rewrite suggestions optimize your bullet points for
              applicant tracking systems (ATS) and human eyes alike.
            </p>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform">
              <FileCheck className="size-32 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
