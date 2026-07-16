import type { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";

export const metadata: Metadata = {
  title: "SkillGap AI | Premium AI Career Intelligence for Engineers",
  description:
    "SkillGap AI analyzes your resume and GitHub, compares real-time job requirements, and shows you exactly what skills and projects you need to get hired.",
  openGraph: {
    title: "SkillGap AI | Premium AI Career Intelligence",
    description: "Close your engineering skill gaps and get hired faster with data-driven career planning.",
  },
};
import { TrustBar } from "@/components/landing/trust-bar";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Features } from "@/components/landing/features";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";
import { ScrollEffects } from "@/components/landing/scroll-effects";

export default function Home() {
  return (
    <>
      <Header />
      <ScrollEffects />
      <main className="relative pt-20 overflow-x-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full soft-glow -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-[20%] left-0 w-[600px] h-[600px] bg-tertiary-fixed/30 rounded-full soft-glow -z-10 -translate-x-1/2"></div>
        <Hero />
        <TrustBar />
        <DashboardPreview />
        <Features />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
