import { Suspense } from "react";
import { PlanView } from "@/components/plan/PlanView";
import { prisma } from "@/lib/db";
import type { GeneratedPlan } from "@/lib/llm/schema";
import type { CalcResult } from "@/lib/quiz/types";

async function PlanInner({ token }: { token: string }) {
  const order = await prisma.order.findUnique({
    where: { token },
    include: { quiz: { include: { plan: true } } },
  });

  if (!order || order.status !== "paid") {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">План ещё не оплачен</h1>
        <p className="mt-2 text-sm text-stone-500">
          Если вы только что оплатили, подождите минуту и обновите страницу.
        </p>
      </div>
    );
  }

  const planStatus = order.quiz.plan?.status ?? "generating";
  if (planStatus !== "ready" || !order.quiz.plan?.content) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold">Собираем меню…</h1>
        <p className="mt-2 text-sm text-stone-500">
          Обычно это занимает меньше минуты. Обновите страницу.
        </p>
        <meta httpEquiv="refresh" content="3" />
      </div>
    );
  }

  const calc = JSON.parse(order.quiz.calcJson) as CalcResult;
  const plan = JSON.parse(order.quiz.plan.content) as GeneratedPlan;
  return <PlanView calc={calc} plan={plan} token={token} />;
}

async function PlanLoader({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <PlanInner token={token} />;
}

export default function PlanPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          Открываем план…
        </div>
      }
    >
      <PlanLoader params={params} />
    </Suspense>
  );
}
