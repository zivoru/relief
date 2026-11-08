import { prisma } from "@/lib/db";
import { sendPlanEmail } from "@/lib/email";
import { getRobokassaConfig, resultSignature } from "@/lib/robokassa";
import type { CalcResult } from "@/lib/quiz/types";

async function handle(form: URLSearchParams) {
  const outSum = form.get("OutSum") ?? "";
  const invId = Number(form.get("InvId") ?? "0");
  const signature = (form.get("SignatureValue") ?? "").toLowerCase();
  const cfg = getRobokassaConfig();

  const expected = resultSignature({
    amount: outSum,
    invId,
    password2: cfg.password2,
  }).toLowerCase();

  if (!invId || signature !== expected) {
    return new Response("bad sign", { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: invId },
    include: { quiz: true },
  });
  if (!order) return new Response("not found", { status: 404 });

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

  return new Response(`OK${invId}`);
}

export async function POST(request: Request) {
  const text = await request.text();
  return handle(new URLSearchParams(text));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return handle(url.searchParams);
}
