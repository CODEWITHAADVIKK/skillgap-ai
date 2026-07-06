"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface SkillRadarChartProps {
  currentSkills: string[];
  gaps: { skill: string; marketImportance: number }[];
}

export function SkillRadarChart({ currentSkills, gaps }: SkillRadarChartProps) {
  // Build radar data from top gaps + current skills
  const topGaps = gaps.slice(0, 6);
  const data = topGaps.map((gap) => ({
    skill: gap.skill.length > 8 ? gap.skill.slice(0, 8) + ".." : gap.skill,
    market: gap.marketImportance,
    current: currentSkills.some((s) =>
      s.toLowerCase().includes(gap.skill.toLowerCase())
    )
      ? Math.round(gap.marketImportance * 0.8)
      : Math.round(gap.marketImportance * 0.15),
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-on-surface-variant text-label-sm">
        Complete onboarding to see your radar
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#e6e0ed" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fontSize: 11, fill: "#484555", fontWeight: 600 }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e6e0ed",
            fontSize: "12px",
          }}
        />
        <Radar
          name="Market Demand"
          dataKey="market"
          stroke="#5e3bdb"
          fill="#5e3bdb"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name="Your Level"
          dataKey="current"
          stroke="#8c4c00"
          fill="#8c4c00"
          fillOpacity={0.1}
          strokeWidth={2}
          strokeDasharray="4 2"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
