import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "About — SkillGap AI",
  description:
    "Learn how SkillGap AI is closing the gap between talent and opportunity with AI-powered career intelligence for engineers.",
  openGraph: {
    title: "About — SkillGap AI",
    description: "Learn how SkillGap AI is closing the gap between talent and opportunity.",
  },
};

const TEAM = [
  { name: "Arjun Sharma", role: "CEO & Co-founder", bio: "Ex-Google, Stanford CS. Built hiring infrastructure that screened 1M+ candidates." },
  { name: "Priya Nair", role: "CTO & Co-founder", bio: "Ex-OpenAI engineer. Designed LLM pipelines for career intelligence at scale." },
  { name: "Marcus Chen", role: "Head of Product", bio: "Former engineering manager at Stripe. Obsessed with developer career acceleration." },
];

const STATS = [
  { value: "50,000+", label: "Engineers Analyzed" },
  { value: "89%", label: "Report Accuracy" },
  { value: "3x", label: "Faster Hiring" },
  { value: "$200M+", label: "Salary Unlocked" },
];

const VALUES = [
  { icon: "visibility", title: "Radical Transparency", description: "We show you exactly what's holding you back — no vague advice, just precise, actionable intelligence." },
  { icon: "bolt", title: "Speed to Insight", description: "Every second a great opportunity exists unclaimed costs engineers thousands. We move fast." },
  { icon: "diversity_3", title: "Equal Access", description: "The best career guidance shouldn't require expensive coaches or lucky network connections." },
  { icon: "science", title: "Data-Driven", description: "Every recommendation is backed by real market data from thousands of live job postings daily." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      {/* Hero */}
      <section className="pt-40 pb-20 px-gutter max-w-container-max mx-auto">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full text-on-primary-fixed text-label-sm font-label-sm mb-6">
            <span className="material-symbols-outlined text-[18px]">groups</span>
            About SkillGap AI
          </div>
          <h1 className="font-display-xl text-display-xl leading-tight mb-6">
            We&apos;re closing the gap between talent and <span className="italic text-primary">opportunity.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Founded in 2024, SkillGap AI was born from a simple frustration: brilliant engineers were getting rejected not because they lacked talent, but because they didn&apos;t know exactly what skills to build. We fix that.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-primary px-gutter">
        <div className="max-w-container-max mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-[48px] font-bold text-white leading-none mb-2">{stat.value}</p>
              <p className="text-white/70 font-label-md text-label-md">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold mb-4">Our Mission</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
              Every engineer deserves to know exactly what stands between them and their dream role. Not vague feedback. Not expensive coaching. Precise, data-driven intelligence.
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We combine AI analysis of your resume and GitHub with real-time job market data to give you a clear picture of exactly what to learn, build, and showcase — and in what order.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-[20px] bg-white p-5 shadow-sm border border-outline-variant/10">
                <span className="material-symbols-outlined text-primary text-[28px] mb-3 block">{v.icon}</span>
                <h4 className="font-bold text-label-md mb-1">{v.title}</h4>
                <p className="text-[12px] text-on-surface-variant">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-surface-container-low px-gutter">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-12 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TEAM.map((member) => (
              <div key={member.name} className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10 text-center">
                <div className="size-16 rounded-full bg-primary mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{member.name[0]}</span>
                </div>
                <h4 className="font-bold text-body-md">{member.name}</h4>
                <p className="text-primary text-[12px] font-bold mb-3">{member.role}</p>
                <p className="text-[13px] text-on-surface-variant">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-gutter text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-headline-lg text-headline-lg font-bold mb-4">Ready to close your skill gap?</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-8">
            Join 50,000+ engineers who use SkillGap AI to accelerate their careers.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-label-md text-label-md hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <span className="material-symbols-outlined">analytics</span>
            Start free analysis
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
