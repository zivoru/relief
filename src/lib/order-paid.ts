import { prisma } from "@/lib/db";
import { sendPlanEmail } from "@/lib/email";
import type { CalcResult } from "@/lib/quiz/types";

export async function markOrderPaid(invId: number) {
  const order = await prisma.order.findUnique({
    where: { id: invId },
    include: { quiz: true },
  });
  if (!order) return null;

  if (order.status !== "paid") {
    await prisma.order.update({
      where: { id: invId },
      data: { status: "paid", paidAt: new Date() },
    });
    const email = order.email ?? order.quiz.email;
    if (email) {
      const calc = JSON.parse(order.quiz.calcJson) as CalcResult;
      await sendPlanEmail({
        to: email,
        token: order.token,
        forecastLabel: calc.forecastLabel,
      });
    }
  }

  return prisma.order.findUnique({
    where: { id: invId },
    include: { quiz: { include: { plan: true } } },
  });
}
