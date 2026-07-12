export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/auth";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const user = await getOrCreateUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Redirect to onboarding if it is not complete yet
  if (user.profile && !user.profile.onboardingComplete) {
    redirect("/onboarding");
  }

  // Serialize the user object to avoid Next.js warnings about passing Date objects from Server to Client
  const serializedUser = JSON.parse(JSON.stringify(user));

  return <ProfileClient user={serializedUser} />;
}
