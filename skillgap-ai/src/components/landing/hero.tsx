import Link from "next/link";

export function Hero() {
  return (
    <section className="relative px-gutter pt-stack-xl pb-stack-xl max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <div className="z-10 space-y-stack-lg">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full text-on-primary-fixed text-label-sm font-label-sm">
          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
          AI-Powered Career Intelligence
        </div>
        <h1 className="font-display-xl text-display-xl leading-tight">
          Close the <span className="italic text-primary">skill gap.</span>
          <br />
          Get <span className="text-tertiary">hired faster.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
          SkillGap AI analyzes your resume and GitHub, compares real-time job
          requirements, and shows you exactly what skills and projects you need
          to get hired.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            className="px-8 py-4 bg-primary text-white rounded-full font-label-md text-label-md flex items-center justify-center gap-3 hover:shadow-xl hover:-translate-y-1 transition-all"
            href="/onboarding"
          >
            <span className="material-symbols-outlined">analytics</span>
            Analyze my profile
          </Link>
          <Link
            className="px-8 py-4 bg-white/50 backdrop-blur border border-outline-variant/30 rounded-full font-label-md text-label-md flex items-center justify-center gap-3 hover:bg-white transition-all"
            href="/demo"
          >
            <span className="material-symbols-outlined">play_circle</span>
            See how it works
          </Link>
        </div>
        <div className="pt-6 font-label-sm text-label-sm text-on-surface-variant/60">
          Free analysis • No credit card required
        </div>
      </div>
      <div className="relative group">
        <div className="glass-card p-8 rounded-[32px] shadow-2xl relative z-10 shimmer-effect">
          <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-4">
            <div>
              <p className="text-label-sm text-on-surface-variant mb-1">
                Current Skill Score
              </p>
              <h3 className="text-headline-md font-bold text-primary">
                72
                <span className="text-on-surface-variant font-normal">/100</span>
              </h3>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[10px] font-bold uppercase tracking-wider">
                Level Up
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                <p className="text-label-sm text-on-surface-variant">
                  Missing High-Impact Skills
                </p>
                <ul className="mt-2 space-y-2">
                  <li className="flex justify-between text-label-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-error rounded-full"></span>
                      Docker
                    </span>
                    <span className="text-error">Critical</span>
                  </li>
                  <li className="flex justify-between text-label-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-tertiary rounded-full"></span>
                      Redis
                    </span>
                    <span className="text-tertiary">Medium</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-primary-container/10 rounded-2xl border border-primary-container/20">
                <p className="text-label-sm text-primary font-bold">
                  Suggested Project
                </p>
                <p className="text-body-md font-bold mt-1 leading-tight">
                  Scalable Real-time Chat with Redis
                </p>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-primary/10 flex items-center justify-center relative">
                <div className="absolute inset-0 border-t-8 border-primary rounded-full animate-spin [animation-duration:3s]"></div>
                <span className="material-symbols-outlined text-primary text-4xl">
                  radar
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 glass-card rounded-2xl p-4 shadow-lg animate-bounce [animation-duration:5s] z-20 hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-1 w-full bg-primary-container/30 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-primary"></div>
            </div>
            <p className="text-[10px] font-bold text-center">
              Resume Score Improved +15%
            </p>
          </div>
        </div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-tertiary/5 soft-glow -z-10"></div>
      </div>
    </section>
  );
}
