"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@/lib/clerk-client";
import {
  BarChart3,
  CircleHelp,
  FileSearch,
  FolderKanban,
  GitCompare,
  LayoutDashboard,
  LogOut,
  Mic,
  Settings,
  TrendingUp,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/lib/ui-store";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/gap-analysis", label: "Gap Analysis", icon: GitCompare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/skill-trends", label: "Skill Trends", icon: TrendingUp },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/interview-prep", label: "Interview Prep", icon: Mic },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();

  const handleLinkClick = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Backdrop overlay for mobile drawer */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-on-surface/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col bg-surface-container-low px-4 py-6 transition-transform duration-300 lg:sticky lg:top-0 lg:z-0 lg:flex lg:translate-x-0 h-screen border-r border-outline-variant/10",
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between mb-8 px-3">
          <Link
            href="/dashboard"
            onClick={handleLinkClick}
            className="font-headline-md text-headline-md font-bold text-primary"
          >
            SkillGap AI
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl hover:bg-surface-container-high text-on-surface-variant"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                onClick={handleLinkClick}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 font-label-md text-label-md transition-colors",
                  active
                    ? "bg-primary text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 space-y-2 border-t border-outline-variant/20 pt-4">
          <Button asChild className="w-full rounded-xl" onClick={handleLinkClick}>
            <Link href="/onboarding?step=3">
              <FileSearch className="size-4" />
              Analyze Resume
            </Link>
          </Button>

          <Link
            href="/support"
            onClick={handleLinkClick}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
          >
            <CircleHelp className="size-5 shrink-0" />
            Support
          </Link>

          <SignOutButton>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container-high"
            >
              <LogOut className="size-5 shrink-0" />
              Log out
            </button>
          </SignOutButton>
        </div>

        {/* User profile card at bottom */}
        {user && (
          <div className="mt-4 pt-4 border-t border-outline-variant/20">
            <Link
              href="/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface-container-high transition-colors group"
            >
              <div className="relative size-9 shrink-0">
                {user.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName ?? "User avatar"}
                    width={36}
                    height={36}
                    className="rounded-full object-cover size-9"
                  />
                ) : (
                  <div className="size-9 rounded-full bg-primary flex items-center justify-center text-white font-bold text-label-sm">
                    {user.firstName?.[0] ?? "U"}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-md text-label-md font-bold text-on-surface truncate">
                  {user.fullName ?? user.firstName ?? "User"}
                </p>
                <p className="text-[11px] text-primary group-hover:underline">View Profile</p>
              </div>
            </Link>

            {/* Gradient accent */}
            <div className="mt-3 h-1 rounded-full bg-gradient-to-r from-primary via-primary/60 to-transparent" />
          </div>
        )}
      </aside>
    </>
  );
}
