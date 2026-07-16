import { TrendingUp, Brain, Map, CheckCircle2 } from "lucide-react";

export function Features() {
  return (
    <section
      id="features"
      className="py-12 md:py-20 bg-white relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-5 pointer-events-none">
        <div className="w-[1200px] h-[1200px] border border-primary/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="w-[900px] h-[900px] border border-primary/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-center relative z-10">
        <div className="space-y-4 px-4">
          <div className="w-16 h-16 glass-card border-none bg-surface-container mx-auto rounded-full flex items-center justify-center shadow-inner">
            <TrendingUp className="size-8 text-primary" />
          </div>
          <h4 className="font-bold text-headline-md">Real Market Data</h4>
          <p className="text-label-md text-on-surface-variant">
            Analyze 100k+ live job postings daily across major tech hubs.
          </p>
        </div>
        <div className="space-y-4 px-4">
          <div className="w-16 h-16 glass-card border-none bg-surface-container mx-auto rounded-full flex items-center justify-center shadow-inner">
            <Brain className="size-8 text-tertiary" />
          </div>
          <h4 className="font-bold text-headline-md">AI Personalization</h4>
          <p className="text-label-md text-on-surface-variant">
            Recommendations tailored specifically to your unique GitHub
            portfolio.
          </p>
        </div>
        <div className="space-y-4 px-4">
          <div className="w-16 h-16 glass-card border-none bg-surface-container mx-auto rounded-full flex items-center justify-center shadow-inner">
            <Map className="size-8 text-secondary" />
          </div>
          <h4 className="font-bold text-headline-md">Actionable Roadmap</h4>
          <p className="text-label-md text-on-surface-variant">
            Step-by-step guidance from missing skill to technical interview
            prep.
          </p>
        </div>
        <div className="space-y-4 px-4">
          <div className="w-16 h-16 glass-card border-none bg-surface-container mx-auto rounded-full flex items-center justify-center shadow-inner">
            <CheckCircle2 className="size-8 text-on-secondary-fixed" />
          </div>
          <h4 className="font-bold text-headline-md">Proof of Work</h4>
          <p className="text-label-md text-on-surface-variant">
            Get project ideas that recruiters actually value and want to see.
          </p>
        </div>
      </div>
    </section>
  );
}
