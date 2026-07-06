import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null) return "—";
  return `${Math.round(value)}%`;
}

export function formatScore(value: number | null | undefined, max = 100): string {
  if (value == null) return `—/${max}`;
  return `${Math.round(value)}/${max}`;
}
