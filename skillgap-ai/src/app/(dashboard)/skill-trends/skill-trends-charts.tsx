"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Cell,
} from "recharts";

interface SkillTrendsChartsProps {
  dreamRole: string;
  marketTrends: { skill: string; demand: number }[];
}

const HIRING_TRENDS = [
  { month: "Jan", count: 120 },
  { month: "Feb", count: 145 },
  { month: "Mar", count: 168 },
  { month: "Apr", count: 190 },
  { month: "May", count: 210 },
  { month: "Jun", count: 235 },
];

const SALARY_BY_LEVEL = [
  { level: "Junior", min: 70, mid: 90, senior: 120 },
  { level: "Mid", min: 100, mid: 130, senior: 155 },
  { level: "Senior", min: 140, mid: 170, senior: 200 },
  { level: "Lead", min: 160, mid: 195, senior: 240 },
];

export function SkillTrendsCharts({ dreamRole, marketTrends }: SkillTrendsChartsProps) {
  const topSkills = marketTrends.length
    ? marketTrends.slice(0, 8)
    : [
        { skill: "React", demand: 95 },
        { skill: "TypeScript", demand: 92 },
        { skill: "AWS", demand: 88 },
        { skill: "Docker", demand: 85 },
        { skill: "Node.js", demand: 82 },
        { skill: "PostgreSQL", demand: 78 },
        { skill: "GraphQL", demand: 72 },
        { skill: "Redis", demand: 68 },
      ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Trending Skills Bar Chart */}
        <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h4 className="font-bold text-body-md mb-6">Trending Skills — {dreamRole}</h4>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={topSkills} layout="vertical" barSize={12} margin={{ left: 10 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="skill" width={80} tick={{ fontSize: 11, fontWeight: 600 }} />
              <Tooltip
                formatter={(value: unknown) => [`${value as number}%`, "Market Demand"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e6e0ed", fontSize: "12px" }}
              />
              <Bar dataKey="demand" radius={[0, 6, 6, 0]}>
                {topSkills.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index < 2 ? "#5e3bdb" : index < 4 ? "#7858f5" : "#e6deff"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Hiring Trends Line Chart */}
        <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
          <h4 className="font-bold text-body-md mb-6">Hiring Volume Trend (2025)</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={HIRING_TRENDS} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1ebf9" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: unknown) => [value as number, "Job Postings"]}
                contentStyle={{ borderRadius: "12px", border: "1px solid #e6e0ed", fontSize: "12px" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#5e3bdb"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "#5e3bdb" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Salary by Level */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
        <h4 className="font-bold text-body-md mb-6">Salary by Experience Level (USD/year)</h4>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={SALARY_BY_LEVEL} barSize={24} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1ebf9" />
            <XAxis dataKey="level" tick={{ fontSize: 11, fontWeight: 600 }} />
            <YAxis tickFormatter={(v) => `$${v}K`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: unknown) => [`$${value as number}K`, ""]}
              contentStyle={{ borderRadius: "12px", border: "1px solid #e6e0ed", fontSize: "12px" }}
            />
            <Bar dataKey="min" fill="#e6deff" name="Minimum" radius={[4, 4, 0, 0]} />
            <Bar dataKey="mid" fill="#7858f5" name="Median" radius={[4, 4, 0, 0]} />
            <Bar dataKey="senior" fill="#5e3bdb" name="Maximum" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex gap-6 justify-center mt-4">
          {[
            { color: "bg-[#e6deff]", label: "Minimum" },
            { color: "bg-[#7858f5]", label: "Median" },
            { color: "bg-[#5e3bdb]", label: "Maximum" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`size-3 rounded-full ${item.color}`} />
              <span className="text-[11px] text-on-surface-variant">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Skill demand progress bars */}
      <div className="rounded-[24px] bg-white p-6 shadow-sm border border-outline-variant/10">
        <h4 className="font-bold text-body-md mb-6">Detailed Skill Demand</h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {topSkills.map((item) => (
            <div key={item.skill}>
              <div className="flex justify-between text-label-md mb-1">
                <span className="font-bold">{item.skill}</span>
                <span className="text-primary font-bold">{item.demand}%</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-700"
                  style={{ width: `${item.demand}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
