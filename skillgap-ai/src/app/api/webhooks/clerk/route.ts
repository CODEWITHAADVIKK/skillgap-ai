import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string; id: string }[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
    primary_email_address_id?: string;
  };
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const svixId = headersList.get("svix-id");
    const svixTimestamp = headersList.get("svix-timestamp");
    const svixSignature = headersList.get("svix-signature");

    // Basic validation — in production use svix SDK to verify signature
    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
    }

    const body = (await request.json()) as ClerkWebhookEvent;

    if (body.type === "user.created" || body.type === "user.updated") {
      const { id, email_addresses, first_name, last_name, image_url, primary_email_address_id } = body.data;

      const primaryEmail = email_addresses?.find(
        (e) => e.id === primary_email_address_id
      )?.email_address;

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email: primaryEmail,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
        create: {
          clerkId: id,
          email: primaryEmail ?? "",
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (body.type === "user.deleted") {
      await prisma.user.deleteMany({
        where: { clerkId: body.data.id },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
