import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export async function getOrCreateUser() {
  const isClerkConfigured =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_dGVzdC1jbGVyay1wdWJsaXNoYWJsZS1rZXk=" &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "pk_test_ZG9tYWluLW5hbWUuY2xlcmsuYWNjb3VudHMuZGV2JA";

  let clerkId = "dev_user_123";
  let email = "developer@skillgap.ai";
  let firstName = "Guest";
  let lastName = "Developer";
  let imageUrl = "/avatars/placeholder.png";

  if (isClerkConfigured) {
    try {
      const authResult = await auth();
      if (!authResult.userId) return null;
      clerkId = authResult.userId;

      const clerkUser = await currentUser();
      if (!clerkUser) return null;

      email = clerkUser.emailAddresses[0]?.emailAddress || "developer@skillgap.ai";
      firstName = clerkUser.firstName || "Guest";
      lastName = clerkUser.lastName || "Developer";
      imageUrl = clerkUser.imageUrl || "/avatars/placeholder.png";
    } catch (e) {
      console.warn("Clerk auth failed, falling back to local dev user:", e);
    }
  }

  // Define fallback mock user in case DB is offline/not initialized
  const mockUser = {
    id: "dev_user_id",
    clerkId,
    email,
    firstName,
    lastName,
    imageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
    profile: {
      id: "dev_profile_id",
      userId: "dev_user_id",
      onboardingComplete: true,
      dreamRole: "Full Stack Engineer",
      experienceLevel: "mid",
      weeklyGoalHours: 5,
      weeklyProgressHours: 3,
      careerReadinessScore: 72,
      skillGapScore: 68,
      resumeHealth: 78,
      atsScore: 82,
      githubHealth: 71,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    githubProfile: null,
    skillGaps: [],
    roadmaps: [],
    projects: [],
    resumes: [],
  };

  try {
    let user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        profile: true,
        githubProfile: { include: { repositories: true } },
        skillGaps: { include: { skill: true } },
        roadmaps: { include: { milestones: { orderBy: { orderIndex: "asc" } } } },
        projects: true,
        resumes: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          imageUrl,
          profile: { create: {} },
          settings: { create: {} },
        },
        include: {
          profile: true,
          githubProfile: { include: { repositories: true } },
          skillGaps: { include: { skill: true } },
          roadmaps: { include: { milestones: { orderBy: { orderIndex: "asc" } } } },
          projects: true,
          resumes: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
    }

    // Ensure profile sub-object is instantiated
    if (user && !user.profile) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { profile: { create: {} } },
        include: {
          profile: true,
          githubProfile: { include: { repositories: true } },
          skillGaps: { include: { skill: true } },
          roadmaps: { include: { milestones: { orderBy: { orderIndex: "asc" } } } },
          projects: true,
          resumes: { orderBy: { createdAt: "desc" }, take: 1 },
        },
      });
    }

    return user;
  } catch (error) {
    console.warn("Database connection failed, falling back to mock user session:", error);
    return mockUser;
  }
}
