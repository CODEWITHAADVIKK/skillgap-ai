"use client";

import { BarChart, Bar, ResponsiveContainer, Cell } from "recharts";

interface GithubPulseChartProps {
  health: number;
}

export function GithubPulseChart({ health }: GithubPulseChartProps) {
  // Generate 7-day activity bars based on health score
  const data = [
    { day: "M", value: Math.round(health * 0.5) },
    { day: "T", value: Math.round(health * 0.7) },
    { day: "W", value: Math.round(health * 0.4) },
    { day: "T", value: Math.round(health * 0.9) },
    { day: "F", value: Math.round(health * 0.6) },
    { day: "S", value: Math.round(health * 0.8) },
    { day: "S", value: Math.round(health * 1.0) },
  ];

  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} barSize={6} barGap={2}>
        <Bar dataKey="value" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index === data.length - 1 ? "#5e3bdb" : "#e6deff"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
