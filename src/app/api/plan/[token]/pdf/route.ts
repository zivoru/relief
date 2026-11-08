import { prisma } from "@/lib/db";
import { renderPlanPdf } from "@/lib/pdf";
import type { GeneratedPlan } from "@/lib/llm/schema";
import type { CalcResult } from "@/lib/quiz/types";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const order = await prisma.order.findUnique({
    where: { token },
    include: { quiz: { include: { plan: true } } },
  });
  if (!order || order.status !== "paid" || !order.quiz.plan?.content) {
    return new Response("not found", { status: 404 });
  }
  const calc = JSON.parse(order.quiz.calcJson) as CalcResult;
  const plan = JSON.parse(order.quiz.plan.content) as GeneratedPlan;
  const pdf = await renderPlanPdf(calc, plan);
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="sushka-plan.pdf"',
    },
  });
}
