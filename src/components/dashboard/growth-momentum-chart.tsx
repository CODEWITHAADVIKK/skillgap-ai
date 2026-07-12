"use client";

import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from "recharts";

interface GrowthMomentumChartProps {
  trends: { skill: string; demand: number }[];
}

export function GrowthMomentumChart({ trends }: GrowthMomentumChartProps) {
  const data =
    trends.length > 0
      ? trends.slice(0, 6).map((t) => ({ name: t.skill, value: t.demand }))
      : [
          { name: "React", value: 65 },
          { name: "TS", value: 72 },
          { name: "Docker", value: 55 },
          { name: "AWS", value: 80 },
          { name: "K8s", value: 88 },
          { name: "Go", value: 95 },
        ];

  return (
    <ResponsiveContainer width="100%" height={100}>
      <BarChart data={data} barSize={20} barGap={4}>
        <Tooltip
          cursor={false}
          contentStyle={{
            borderRadius: "12px",
            border: "1px solid #e6e0ed",
            fontSize: "12px",
          }}
          formatter={(value: unknown) => [`${value as number}%`, "Demand"]}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index >= data.length - 2 ? "#5e3bdb" : "#e6deff"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
