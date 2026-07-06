"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ClerkProvider as RealClerkProvider,
  SignOutButton as RealSignOutButton,
  useUser as realUseUser,
} from "@clerk/nextjs";

const isClerkConfigured = !!(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dGVzdC1jbGVyay1wdWJsaXNoYWJsZS1rZXk=" &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_ZG9tYWluLW5hbWUuY2xlcmsuYWNjb3VudHMuZGV2JA"
);

// Mock implementation of useUser
export function useUser() {
  if (isClerkConfigured) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return realUseUser();
  }

  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      id: "dev_user_123",
      firstName: "Guest",
      lastName: "Developer",
      fullName: "Guest Developer",
      imageUrl: "/avatars/placeholder.png",
      emailAddresses: [
        {
          id: "email_1",
          emailAddress: "developer@skillgap.ai",
        },
      ],
    },
  };
}

// Mock implementation of SignOutButton
export function SignOutButton({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (isClerkConfigured) {
    return <RealSignOutButton>{children}</RealSignOutButton>;
  }

  // Handle logout locally by redirecting to home
  const handleSignOut = () => {
    router.push("/");
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

// Mock/Wrapper implementation of ClerkProvider
export function ClerkProvider({ children }: { children: React.ReactNode }) {
  if (isClerkConfigured) {
    return <RealClerkProvider>{children}</RealClerkProvider>;
  }

  // No-op wrapper when Clerk is not configured
  return <>{children}</>;
}

import {
  SignIn as RealSignIn,
  SignUp as RealSignUp,
} from "@clerk/nextjs";

// Mock implementation of SignIn
export function SignIn(props: any) {
  const router = useRouter();

  if (isClerkConfigured) {
    return <RealSignIn {...props} />;
  }

  const handleMockSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl space-y-6">
      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Email address</label>
        <input
          type="email"
          defaultValue="developer@skillgap.ai"
          disabled
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Password</label>
        <input
          type="password"
          defaultValue="supersecretpassword"
          disabled
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none"
        />
      </div>

      <button
        onClick={handleMockSignIn}
        className="w-full py-3.5 bg-primary text-white font-label-md rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all duration-300 transform active:scale-[0.98]"
      >
        Sign In as Guest
      </button>

      <div className="text-center pt-2">
        <p className="text-label-sm text-on-surface-variant">
          Demo Instance: Credentials are auto-configured for convenience.
        </p>
      </div>
    </div>
  );
}

// Mock implementation of SignUp
export function SignUp(props: any) {
  const router = useRouter();

  if (isClerkConfigured) {
    return <RealSignUp {...props} />;
  }

  const handleMockSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/onboarding");
  };

  return (
    <div className="w-full bg-white rounded-3xl p-8 border border-outline-variant/20 shadow-xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-label-sm font-bold text-on-surface-variant">First name</label>
          <input
            type="text"
            defaultValue="Guest"
            disabled
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-label-sm font-bold text-on-surface-variant">Last name</label>
          <input
            type="text"
            defaultValue="Developer"
            disabled
            className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-label-sm font-bold text-on-surface-variant">Email address</label>
        <input
          type="email"
          defaultValue="developer@skillgap.ai"
          disabled
          className="w-full px-4 py-3 rounded-xl border border-outline-variant/30 bg-surface-container-low text-on-surface font-body-md focus:outline-none"
        />
      </div>

      <button
        onClick={handleMockSignUp}
        className="w-full py-3.5 bg-primary text-white font-label-md rounded-full shadow-lg shadow-primary/20 hover:bg-primary/95 transition-all duration-300 transform active:scale-[0.98]"
      >
        Create Guest Account
      </button>

      <div className="text-center pt-2">
        <p className="text-label-sm text-on-surface-variant">
          Demo Instance: Accounts are simulated locally in development.
        </p>
      </div>
    </div>
  );
}
