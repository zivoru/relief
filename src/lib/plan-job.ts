import { prisma } from "@/lib/db";
import { generatePlan } from "@/lib/llm/generate";
import type { CalcResult, QuizAnswers } from "@/lib/quiz/types";

export async function runPlanGeneration(quizId: string): Promise<void> {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  if (!quiz) return;
  const answers = JSON.parse(quiz.answersJson) as QuizAnswers;
  const calc = JSON.parse(quiz.calcJson) as CalcResult;
  try {
    const content = await generatePlan(calc, answers);
    await prisma.plan.update({
      where: { quizId },
      data: { status: "ready", content: JSON.stringify(content) },
    });
  } catch (error) {
    console.error("plan generation failed", error);
    await prisma.plan.update({
      where: { quizId },
      data: { status: "error" },
    });
  }
}
