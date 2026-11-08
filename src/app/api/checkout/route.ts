import { prisma } from "@/lib/db";
import { sendPlanEmail } from "@/lib/email";
import { buildPaymentUrl } from "@/lib/robokassa";
import type { CalcResult } from "@/lib/quiz/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    orderId?: number;
    email?: string;
    consentPd?: boolean;
    consentHealth?: boolean;
  };
  if (!body.orderId || !body.email || !body.consentPd || !body.consentHealth) {
    return Response.json({ error: "need email and consents" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: body.orderId },
    include: { quiz: true },
  });
  if (!order) {
    return Response.json({ error: "order not found" }, { status: 404 });
  }

  await prisma.quiz.update({
    where: { id: order.quizId },
    data: {
      email: body.email,
      consentPd: true,
      consentHealth: true,
    },
  });
  await prisma.order.update({
    where: { id: order.id },
    data: { email: body.email },
  });

  if (process.env.PAYMENT_MODE === "mock" || !process.env.ROBOKASSA_LOGIN) {
    await prisma.order.update({
      where: { id: order.id },
      data: { status: "paid", paidAt: new Date() },
    });
    const calc = JSON.parse(order.quiz.calcJson) as CalcResult;
    await sendPlanEmail({
      to: body.email,
      token: order.token,
      forecastLabel: calc.forecastLabel,
    });
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";
    return Response.json({
      url: `${appUrl}/pay/success?invId=${order.id}&token=${order.token}&mock=1`,
    });
  }

  const url = buildPaymentUrl({
    invId: order.id,
    amount: order.amountRub,
    email: body.email,
    token: order.token,
  });
  return Response.json({ url });
}
