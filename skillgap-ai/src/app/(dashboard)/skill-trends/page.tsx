import { DashboardHeader } from "@/components/dashboard/header";
import { getDashboardData } from "@/lib/data/dashboard";
import { SkillTrendsCharts } from "./skill-trends-charts";

export default async function SkillTrendsPage() {
  const data = await getDashboardData();

  return (
    <>
      <DashboardHeader
        title="Skill Trends"
        subtitle={`Live market demand data for ${data.profile.dreamRole} roles, aggregated from thousands of job postings daily.`}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Median Salary", value: "$142,000", sub: `for ${data.profile.dreamRole}` },
          { label: "Salary Range", value: "$90K — $200K", sub: "Market wide" },
          { label: "Top Hiring", value: "Stripe, Google, Amazon", sub: "Active this month" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
            <p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">{stat.label}</p>
            <p className="font-bold text-headline-md text-primary truncate">{stat.value}</p>
            <p className="text-[11px] text-on-surface-variant mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Interactive Charts (client component) */}
      <SkillTrendsCharts
        dreamRole={data.profile.dreamRole}
        marketTrends={data.marketTrends}
      />
    </>
  );
}
