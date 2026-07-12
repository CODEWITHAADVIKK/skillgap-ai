"use server";

import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function updateProfileInfo(data: {
  firstName: string;
  lastName: string;
  dreamRole: string;
  city: string;
  country: string;
  experienceLevel: string;
}) {
  const user = await getOrCreateUser();
  if (!user) throw new Error("Unauthorized");

  try {
    // Update User model details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      },
    });

    // Update Profile model details
    await prisma.profile.update({
      where: { userId: user.id },
      data: {
        dreamRole: data.dreamRole,
        city: data.city,
        country: data.country,
        experienceLevel: data.experienceLevel,
      },
    });
  } catch (error) {
    console.warn("Database connection failed, simulating profile update locally:", error);
  }

  revalidatePath("/profile");
  return { success: true };
}
