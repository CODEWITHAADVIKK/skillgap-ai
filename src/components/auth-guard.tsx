"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dGVzdC1jbGVyay1wdWJsaXNoYWJsZS1rZXk=" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_ZG9tYWluLW5hbWUuY2xlcmsuYWNjb3VudHMuZGV2JA"
);

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isHydrated, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    // Skip guard when real Clerk is configured — Clerk middleware handles it
    if (isClerkConfigured) return;

    // Wait for store to hydrate from localStorage before redirecting
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.replace("/sign-in");
    }
  }, [isAuthenticated, isHydrated, router, pathname]);

  // When Clerk is configured, render immediately (Clerk middleware protects routes)
  if (isClerkConfigured) {
    return <>{children}</>;
  }

  // While hydrating, show nothing to prevent flash
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not authenticated — will redirect, show nothing
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
