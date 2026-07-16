import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing — SkillGap AI",
  description:
    "Simple, transparent pricing for SkillGap AI. Start free, upgrade when you need more. Cancel anytime.",
  openGraph: {
    title: "Pricing — SkillGap AI",
    description: "Simple, transparent pricing. Start free, upgrade when you need more.",
  },
};

const PLANS = [
  {
    id: "free",
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring your career potential.",
    features: [
      "1 resume analysis",
      "Basic skill gap detection",
      "5 AI Copilot messages/day",
      "3 interview practice sessions",
      "Career Readiness Score",
    ],
    cta: "Get started free",
    href: "/sign-up",
    highlighted: false,
    accent: "border-outline-variant/20",
  },
  {
    id: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For engineers serious about landing their dream role.",
    features: [
      "Unlimited resume analyses",
      "Full AI skill gap analysis",
      "Unlimited AI Copilot",
      "AI mock interview scoring",
      "PDF career reports",
      "GitHub portfolio analysis",
      "Live job market data",
      "Application tracker",
      "Priority support",
    ],
    cta: "Start Pro — 7 days free",
    href: "/sign-up?plan=pro",
    highlighted: true,
    accent: "border-primary",
  },
  {
    id: "team",
    name: "Teams",
    price: "$49",
    period: "/month",
    description: "For bootcamps, universities, and hiring orgs.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team analytics dashboard",
      "Bulk resume processing",
      "Custom skill frameworks",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact sales",
    href: "/contact",
    highlighted: false,
    accent: "border-outline-variant/20",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />

      <section className="pt-40 pb-20 px-gutter max-w-container-max mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full text-on-primary-fixed text-label-sm font-label-sm mb-6">
          <span className="material-symbols-outlined text-[18px]">sell</span>
          Simple, transparent pricing
        </div>
        <h1 className="font-display-xl text-display-xl leading-tight mb-6">
          Invest in your <span className="italic text-primary">career.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Start free, upgrade when you need more. Cancel anytime.
        </p>
      </section>

      <section className="pb-20 px-gutter max-w-container-max mx-auto">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-[28px] p-8 border-2 relative flex flex-col ${plan.accent} ${plan.highlighted ? "bg-primary shadow-2xl" : "bg-white shadow-sm"}`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-tertiary-fixed text-on-tertiary-fixed rounded-full text-[11px] font-bold uppercase tracking-wide">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className={`font-bold text-headline-md mb-1 ${plan.highlighted ? "text-white" : "text-on-surface"}`}>
                  {plan.name}
                </h3>
                <p className={`text-[13px] mb-4 ${plan.highlighted ? "text-white/70" : "text-on-surface-variant"}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-[48px] font-bold leading-none ${plan.highlighted ? "text-white" : "text-on-surface"}`}>
                    {plan.price}
                  </span>
                  <span className={`text-label-md ${plan.highlighted ? "text-white/70" : "text-on-surface-variant"}`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <div className={`size-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlighted ? "bg-white/20" : "bg-primary/10"}`}>
                      <Check className={`size-3 ${plan.highlighted ? "text-white" : "text-primary"}`} />
                    </div>
                    <span className={`text-[13px] ${plan.highlighted ? "text-white/90" : "text-on-surface-variant"}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3.5 rounded-full font-label-md text-label-md transition-all ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-white hover:opacity-90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <p className="text-on-surface-variant font-body-md text-body-md">
            Have questions?{" "}
            <Link href="/contact" className="text-primary font-bold hover:underline">
              Contact our team →
            </Link>
          </p>
        </div>
      </section>
      <Footer />
    </div>
  );
}
