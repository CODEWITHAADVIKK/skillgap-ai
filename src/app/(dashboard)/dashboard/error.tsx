"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
      <div className="rounded-[32px] bg-white p-8 shadow-sm border border-outline-variant/10 max-w-md w-full flex flex-col items-center">
        <div className="size-16 rounded-2xl bg-error/10 flex items-center justify-center mb-6">
          <AlertCircle className="size-8 text-error" />
        </div>
        <h2 className="font-bold text-headline-md mb-2">Something went wrong</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          Failed to load dashboard data. This could be due to a temporary network issue or server error.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-label-md font-bold text-white hover:opacity-90 transition-opacity"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
