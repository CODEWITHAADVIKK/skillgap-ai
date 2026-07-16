"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useUIStore } from "@/lib/ui-store";

export function MobileHeader() {
  const toggleMobileSidebar = useUIStore((state) => state.toggleMobileSidebar);

  return (
    <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface-container-low border-b border-outline-variant/10 sticky top-0 z-30">
      <Link href="/dashboard" className="font-headline-md text-headline-md font-bold text-primary">
        SkillGap AI
      </Link>
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center"
        aria-label="Open navigation menu"
      >
        <Menu className="size-6" />
      </button>
    </header>
  );
}
