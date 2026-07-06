import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { structuredCompletion } from "@/lib/services/openai";

interface EvaluateRequest {
  question: string;
  answer: string;
  role: string;
  category: string;
}

interface EvaluationResult {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
  strengths: string[];
  improvements: string[];
  betterAnswer: string;
  keyPoints: string[];
  confidence: number;
}

const INTERVIEW_EVAL_PROMPT = `You are an expert technical interviewer evaluating candidate answers for software engineering roles.

Evaluate the answer and return JSON with exactly these fields:
{
  "score": number (0-100),
  "grade": "A" | "B" | "C" | "D" | "F",
  "strengths": string[] (2-3 specific strengths),
  "improvements": string[] (2-3 specific areas to improve),
  "betterAnswer": string (brief ideal answer structure in 2-3 sentences),
  "keyPoints": string[] (3-4 key technical points the answer should cover),
  "confidence": number (0-100, how confident you are in this evaluation)
}

Scoring: A=90+, B=80-89, C=70-79, D=60-69, F<60
Be constructive, specific, and accurate.`;

export async function POST(request: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as EvaluateRequest;

    if (!body.question || !body.answer) {
      return NextResponse.json({ error: "Question and answer required" }, { status: 400 });
    }

    const userPrompt = `
Role: ${body.role}
Category: ${body.category}

Question: ${body.question}

Candidate's Answer: ${body.answer}

Please evaluate this answer.`;

    const result = await structuredCompletion<EvaluationResult>(
      INTERVIEW_EVAL_PROMPT,
      userPrompt
    );

    if (!result) {
      // Fallback evaluation if OpenAI is not configured
      const wordCount = body.answer.split(" ").length;
      const score = Math.min(85, Math.max(40, wordCount * 1.5 + 30));
      return NextResponse.json({
        score: Math.round(score),
        grade: score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F",
        strengths: ["Attempted to answer the question", "Shows some familiarity with the topic"],
        improvements: [
          "Add more technical depth and specific examples",
          "Structure your answer using the STAR method for behavioral questions",
          "Include concrete metrics or outcomes where applicable",
        ],
        betterAnswer:
          "A strong answer would include specific examples from experience, technical implementation details, and measurable outcomes or lessons learned.",
        keyPoints: ["Specific technical concepts", "Real-world examples", "Problem-solving approach", "Results and impact"],
        confidence: 60,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Interview evaluation error:", error);
    return NextResponse.json(
      { error: "Evaluation failed. Please try again." },
      { status: 500 }
    );
  }
}
