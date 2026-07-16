export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* ── Hero Card Skeleton ───────────────────────────────────────── */}
      <div className="rounded-[28px] bg-white p-8 border border-outline-variant/10 relative overflow-hidden">
        <div className="absolute top-6 right-6 flex items-center gap-2">
          <div className="h-6 w-16 bg-surface-container-high rounded-full" />
          <div className="h-6 w-24 bg-surface-container-high rounded-full" />
        </div>
        <div className="h-8 w-64 bg-surface-container-high rounded-lg mb-4" />
        <div className="h-4 w-full max-w-2xl bg-surface-container-high rounded-lg mb-8" />
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="h-3 w-32 bg-surface-container-high rounded-lg" />
            <div className="h-3 w-16 bg-surface-container-high rounded-lg" />
          </div>
          <div className="h-2.5 bg-surface-container-high rounded-full w-full" />
        </div>
      </div>

      {/* ── Main Grid Row 1 Skeleton ────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Career Readiness Skeleton */}
        <div className="lg:col-span-4 rounded-[28px] bg-white p-6 border border-outline-variant/10 flex flex-col justify-between">
          <div className="h-5 w-36 bg-surface-container-high rounded-lg mb-6" />
          <div className="flex justify-center mb-6">
            <div className="size-32 rounded-full border-8 border-surface-container-high flex items-center justify-center">
              <div className="size-16 rounded-full bg-surface-container-high" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2 mb-6">
            <div className="h-10 bg-surface-container-high rounded-xl" />
            <div className="h-10 bg-surface-container-high rounded-xl" />
          </div>
          <div className="h-8 bg-surface-container-high rounded-full w-full" />
        </div>

        {/* ATS Score + GitHub Pulse columns */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Two small cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[28px] bg-white p-6 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-xl bg-surface-container-high" />
                <div className="h-4 w-20 bg-surface-container-high rounded-lg" />
              </div>
              <div className="h-5 w-28 bg-surface-container-high rounded-lg mb-2" />
              <div className="h-4 w-full bg-surface-container-high rounded-lg mb-4" />
              <div className="h-4 w-24 bg-surface-container-high rounded-lg" />
            </div>

            <div className="rounded-[28px] bg-white p-6 border border-outline-variant/10">
              <div className="flex items-center justify-between mb-4">
                <div className="size-10 rounded-xl bg-surface-container-high" />
                <div className="h-4 w-20 bg-surface-container-high rounded-lg" />
              </div>
              <div className="h-5 w-28 bg-surface-container-high rounded-lg mb-2" />
              <div className="h-10 w-full bg-surface-container-high rounded-xl mb-2" />
              <div className="h-4 w-full bg-surface-container-high rounded-lg" />
            </div>
          </div>

          {/* Recommended Next Steps Skeleton */}
          <div className="rounded-[28px] bg-white p-6 border border-outline-variant/10">
            <div className="h-5 w-48 bg-surface-container-high rounded-lg mb-4" />
            <div className="space-y-3">
              <div className="h-16 bg-surface-container-high rounded-2xl w-full" />
              <div className="h-16 bg-surface-container-high rounded-2xl w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Featured Project + Growth Momentum Skeletons ──────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-[28px] bg-white overflow-hidden border border-outline-variant/10">
          <div className="h-40 bg-surface-container-high" />
          <div className="p-6">
            <div className="h-6 w-48 bg-surface-container-high rounded-lg mb-2" />
            <div className="h-4 w-full bg-surface-container-high rounded-lg mb-4" />
            <div className="h-10 w-full bg-surface-container-high rounded-full" />
          </div>
        </div>

        <div className="rounded-[28px] bg-white p-6 border border-outline-variant/10">
          <div className="h-5 w-40 bg-surface-container-high rounded-lg mb-4" />
          <div className="h-40 bg-surface-container-high rounded-xl mb-4" />
          <div className="h-10 bg-surface-container-high rounded-xl" />
        </div>
      </div>
    </div>
  );
}
