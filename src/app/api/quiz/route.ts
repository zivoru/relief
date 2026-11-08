import { after } from "next/server";
import crypto from "node:crypto";
import { calculate } from "@/lib/psmf/calc";
import { PRICE_RUB } from "@/lib/psmf/config";
import { prisma } from "@/lib/db";
import { runPlanGeneration } from "@/lib/plan-job";
import { formatAmount } from "@/lib/robokassa";
import type { QuizAnswers } from "@/lib/quiz/types";

function isAnswers(value: unknown): value is QuizAnswers {
  if (!value || typeof value !== "object") return false;
  const v = value as QuizAnswers;
  return (
    typeof v.sex === "string" &&
    typeof v.age === "number" &&
    typeof v.heightCm === "number" &&
    typeof v.weightKg === "number" &&
    typeof v.bodyFatPct === "number"
  );
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    answers?: unknown;
    utm?: Record<string, string>;
  };
  if (!isAnswers(body.answers)) {
    return Response.json({ error: "invalid answers" }, { status: 400 });
  }
  const calc = calculate(body.answers);
  const token = crypto.randomBytes(18).toString("hex");

  const quiz = await prisma.quiz.create({
    data: {
      answersJson: JSON.stringify(body.answers),
      calcJson: JSON.stringify(calc),
      utmJson: JSON.stringify(body.utm ?? {}),
      plan: { create: { status: "generating" } },
      orders: {
        create: {
          amountRub: formatAmount(PRICE_RUB),
          status: "pending",
          token,
        },
      },
    },
    include: { orders: true },
  });

  after(() => runPlanGeneration(quiz.id));

  const order = quiz.orders[0];
  return Response.json({
    quizId: quiz.id,
    orderId: order.id,
    token: order.token,
    amountRub: order.amountRub,
    calc,
  });
}
