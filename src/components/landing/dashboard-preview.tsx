export function DashboardPreview() {
  return (
    <section className="py-stack-xl px-gutter max-w-container-max mx-auto">
      <div className="mb-stack-lg space-y-4">
        <span className="px-4 py-1.5 bg-surface-container-high rounded-full text-on-surface-variant text-label-sm font-label-sm">
          Dashboard Ecosystem
        </span>
        <h2 className="font-headline-lg text-headline-lg">
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
                  <span className="material-symbols-outlined text-[20px]">
                    dashboard
                  </span>
                  <span className="font-label-sm">Overview</span>
                </div>
                <div className="h-10 hover:bg-surface-container-high rounded-xl flex items-center px-4 gap-3 text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    analytics
                  </span>
                  <span className="font-label-sm">Analysis</span>
                </div>
                <div className="h-10 hover:bg-surface-container-high rounded-xl flex items-center px-4 gap-3 text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">
                    assignment
                  </span>
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
            <div className="flex-grow space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                    Skills
                  </p>
                  <p className="text-headline-md font-bold">48</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                    Gaps
                  </p>
                  <p className="text-headline-md font-bold text-error">12</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                    Projects
                  </p>
                  <p className="text-headline-md font-bold text-primary">3</p>
                </div>
                <div className="p-4 bg-surface-container rounded-2xl">
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">
                    Rank
                  </p>
                  <p className="text-headline-md font-bold text-tertiary">
                    Top 8%
                  </p>
                </div>
              </div>
              <div className="p-6 bg-white rounded-[24px] border border-outline-variant/10 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-bold text-body-md">Skill Radar Analysis</h4>
                  <button className="text-primary text-label-sm">Details</button>
                </div>
                <div className="h-48 flex items-end justify-between gap-2 px-4">
                  <div className="w-full bg-primary/10 rounded-t-lg h-[40%] transition-all group-hover:h-[60%]"></div>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[70%] transition-all group-hover:h-[85%]"></div>
                  <div className="w-full bg-primary rounded-t-lg h-[55%] transition-all group-hover:h-[70%]"></div>
                  <div className="w-full bg-primary/40 rounded-t-lg h-[90%] transition-all group-hover:h-[95%]"></div>
                  <div className="w-full bg-primary/20 rounded-t-lg h-[45%] transition-all group-hover:h-[55%]"></div>
                  <div className="w-full bg-primary/60 rounded-t-lg h-[30%] transition-all group-hover:h-[40%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="flex-grow glass-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined">sync</span>
            </div>
            <h3 className="text-headline-md font-bold">Live Sync</h3>
            <p className="text-on-surface-variant">
              We monitor thousands of job postings daily to ensure your career
              roadmap is always based on the latest industry demands.
            </p>
            <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-[160px]">
                database
              </span>
            </div>
          </div>
          <div className="flex-grow glass-card rounded-[32px] p-8 space-y-6 relative overflow-hidden group bg-primary-fixed/30">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">history_edu</span>
            </div>
            <h3 className="text-headline-md font-bold">Smart Resume</h3>
            <p className="text-on-surface-variant">
              Our AI rewrite suggestions optimize your bullet points for
              applicant tracking systems (ATS) and human eyes alike.
            </p>
            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-[140px]">
                description
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
