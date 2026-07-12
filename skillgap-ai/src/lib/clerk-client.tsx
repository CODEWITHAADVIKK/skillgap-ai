"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ClerkProvider as RealClerkProvider,
  SignOutButton as RealSignOutButton,
  useUser as realUseUser,
} from "@clerk/nextjs";
import { useAuthStore } from "@/lib/auth-store";

const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dGVzdC1jbGVyay1wdWJsaXNoYWJsZS1rZXk=" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_ZG9tYWluLW5hbWUuY2xlcmsuYWNjb3VudHMuZGV2JA"
);

// Redirect destinations — honor the env vars Clerk would use in production
const AFTER_SIGN_IN_URL =
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/dashboard";
const AFTER_SIGN_UP_URL =
  process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/onboarding";

// ─── useUser ────────────────────────────────────────────────────────────────────

export function useUser() {
  if (isClerkConfigured) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return realUseUser();
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated, user, isHydrated, hydrate } = useAuthStore();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return {
      isLoaded: false,
      isSignedIn: false,
      user: null,
    };
  }

  if (!isAuthenticated || !user) {
    return {
      isLoaded: true,
      isSignedIn: false,
      user: null,
    };
  }

  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      emailAddresses: [
        {
          id: "email_1",
          emailAddress: user.email,
        },
      ],
    },
  };
}

// ─── SignOutButton ──────────────────────────────────────────────────────────────

export function SignOutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const authSignOut = useAuthStore((s) => s.signOut);

  if (isClerkConfigured) {
    return <RealSignOutButton>{children}</RealSignOutButton>;
  }

  const handleSignOut = () => {
    authSignOut();
    router.replace("/");
  };

  if (React.isValidElement(children)) {
    const element = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(element, {
      onClick: (e: React.MouseEvent) => {
        if (element.props.onClick) {
          element.props.onClick(e);
        }
        handleSignOut();
      },
    });
  }

  return <span onClick={handleSignOut}>{children}</span>;
}

// ─── ClerkProvider ──────────────────────────────────────────────────────────────

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return <RealClerkProvider>{children}</RealClerkProvider>;
  }

  return <>{children}</>;
}

import {
  SignIn as RealSignIn,
  SignUp as RealSignUp,
} from "@clerk/nextjs";

// ─── Shared inline SVG icons (no extra deps) ───────────────────────────────────

function CheckIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg className="size-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// ─── SignIn ─────────────────────────────────────────────────────────────────────

export function SignIn(props: any) {
  const router = useRouter();
  const { signIn, isAuthenticated, isHydrated, hydrate } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (isClerkConfigured) {
    return <RealSignIn {...props} />;
  }

  // Show spinner while hydrating to prevent flash
  if (!isHydrated) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex items-center justify-center min-h-[280px]">
        <SpinnerIcon />
      </div>
    );
  }

  // Already authenticated — will redirect, show nothing
  if (isAuthenticated) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex flex-col items-center justify-center min-h-[280px] gap-3">
        <SpinnerIcon />
        <p className="text-label-sm text-on-surface-variant">Redirecting to dashboard…</p>
      </div>
    );
  }

  const handleMockSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    // Small delay to show loading state visually
    setTimeout(() => {
      const result = signIn(email, password);
      if (!result.success) {
        setError(result.error || "Sign in failed");
        setIsSubmitting(false);
        return;
      }

      // Show success state briefly before redirecting
      setSuccess(true);
      setTimeout(() => {
        router.replace("/dashboard");
      }, 800);
    }, 400);
  };

  return (
    <form onSubmit={handleMockSignIn} className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-on-error-container text-label-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <ErrorIcon />
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-xl bg-primary/10 px-4 py-3 text-primary text-label-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <CheckIcon />
          Welcome back! Redirecting to dashboard…
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting || success}
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-60"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          placeholder="Enter your password"
          autoComplete="current-password"
          disabled={isSubmitting || success}
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || success}
        className="w-full py-3.5 bg-primary text-white font-label-md rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {success ? (
          <>
            <CheckIcon />
            Signed in!
          </>
        ) : isSubmitting ? (
          <>
            <SpinnerIcon />
            Signing in…
          </>
        ) : (
          "Sign In"
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-label-sm text-on-surface-variant">
          Local Dev Mode: Any valid email and password (4+ chars) will work.
        </p>
      </div>
    </form>
  );
}

// ─── SignUp ─────────────────────────────────────────────────────────────────────

export function SignUp(props: any) {
  const router = useRouter();
  const { signUp, isAuthenticated, isHydrated, hydrate } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Auto-redirect if already authenticated
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, router]);

  if (isClerkConfigured) {
    return <RealSignUp {...props} />;
  }

  // Show spinner while hydrating
  if (!isHydrated) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex items-center justify-center min-h-[340px]">
        <SpinnerIcon />
      </div>
    );
  }

  // Already authenticated — will redirect
  if (isAuthenticated) {
    return (
      <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl flex flex-col items-center justify-center min-h-[340px] gap-3">
        <SpinnerIcon />
        <p className="text-label-sm text-on-surface-variant">Redirecting to dashboard…</p>
      </div>
    );
  }

  const handleMockSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const result = signUp(firstName, lastName, email);
      if (!result.success) {
        setError(result.error || "Sign up failed");
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.replace(AFTER_SIGN_UP_URL);
      }, 800);
    }, 400);
  };

  return (
    <form onSubmit={handleMockSignUp} className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl space-y-6">
      {/* Error message */}
      {error && (
        <div className="rounded-xl bg-error-container px-4 py-3 text-on-error-container text-label-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <ErrorIcon />
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="rounded-xl bg-primary/10 px-4 py-3 text-primary text-label-sm font-bold flex items-center gap-2 animate-[fadeIn_0.2s_ease-out]">
          <CheckIcon />
          Account created! Setting up your profile…
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-label-sm font-bold text-on-surface-variant">First name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setError(""); }}
            placeholder="John"
            autoComplete="given-name"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-60"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-label-sm font-bold text-on-surface-variant">Last name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); setError(""); }}
            placeholder="Doe"
            autoComplete="family-name"
            disabled={isSubmitting || success}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-60"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          placeholder="you@example.com"
          autoComplete="email"
          disabled={isSubmitting || success}
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || success}
        className="w-full py-3.5 bg-primary text-white font-label-md rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {success ? (
          <>
            <CheckIcon />
            Account created!
          </>
        ) : isSubmitting ? (
          <>
            <SpinnerIcon />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <div className="text-center pt-2">
        <p className="text-label-sm text-on-surface-variant">
          Local Dev Mode: Accounts are stored locally in your browser.
        </p>
      </div>
    </form>
  );
}
