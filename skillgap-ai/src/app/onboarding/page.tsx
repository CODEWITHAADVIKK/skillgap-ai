import { Suspense } from "react";
import OnboardingPage from "./onboarding-client";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <OnboardingPage />
    </Suspense>
  );
}
