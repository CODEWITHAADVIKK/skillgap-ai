"use client";

import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
} from "recharts";

interface CareerReadinessRingProps {
  score: number;
  resumeScore: number;
  projectScore: number;
  label?: string;
}

function getLabel(score: number): string {
  if (score >= 90) return "ELITE";
  if (score >= 80) return "EXPERT";
  if (score >= 70) return "ADVANCED";
  if (score >= 60) return "PROFICIENT";
  return "LEARNING";
}

export function CareerReadinessRing({
  score,
  resumeScore,
  projectScore,
  label,
}: CareerReadinessRingProps) {
  const displayLabel = label ?? getLabel(score);

  const data = [
    { name: "bg", value: 100, fill: "#ede9f8" },
    { name: "outer", value: score, fill: "#5e3bdb" },
    { name: "middle", value: resumeScore, fill: "#7858f5" },
    { name: "inner", value: projectScore, fill: "#a58cf7" },
  ];

  return (
    <div className="relative flex items-center justify-center">
      <ResponsiveContainer width={200} height={200}>
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius={35}
          outerRadius={95}
          barSize={12}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            background={{ fill: "#f1ebf9" }}
            dataKey="value"
            cornerRadius={8}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      {/* Center text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-[36px] font-bold text-primary leading-none">{score}</span>
        <span className="text-[10px] font-bold text-on-surface-variant tracking-widest mt-0.5">
          {displayLabel}
        </span>
      </div>
    </div>
  );
}
