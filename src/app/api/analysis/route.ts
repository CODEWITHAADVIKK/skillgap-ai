import { NextResponse } from "next/server";
import { generateAIProfile } from "@/lib/actions/onboarding";

export async function POST() {
  try {
    const result = await generateAIProfile();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Analysis failed" },
      { status: 500 }
    );
  }
}
