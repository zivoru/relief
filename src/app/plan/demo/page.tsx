import { Suspense } from "react";
import { PlanView } from "@/components/plan/PlanView";
import { fallbackPlan } from "@/lib/llm/fallback";
import { calculate } from "@/lib/psmf/calc";
import type { QuizAnswers } from "@/lib/quiz/types";

const BASE: Omit<QuizAnswers, "sex" | "heightCm" | "weightKg" | "bodyFatPct"> = {
  gym: "ddx",
  goal: "summer",
  age: 28,
  steps: 8000,
  activity: "gym",
  experience: "trained",
  likedFoods: ["chicken", "cottage", "tuna", "eggwhite"],
  dislikedFoods: [],
  allergens: [],
  stopList: [],
  store: "perekrestok",
  budget: 8000,
  screening: [],
};

function demoAnswers(sex: "male" | "female"): QuizAnswers {
  if (sex === "female") {
    return { ...BASE, sex, heightCm: 168, weightKg: 68, bodyFatPct: 28 };
  }
  return { ...BASE, sex: "male", heightCm: 178, weightKg: 86, bodyFatPct: 20 };
}

async function DemoInner({
  searchParams,
}: {
  searchParams: Promise<{ sex?: string }>;
}) {
  const q = await searchParams;
  const sex = q.sex === "female" ? "female" : "male";
  const answers = demoAnswers(sex);
  const calc = calculate(answers);
  const plan = fallbackPlan(calc, answers);
  return <PlanView calc={calc} plan={plan} token="demo" />;
}

export default function PlanDemoPage({
  searchParams,
}: {
  searchParams: Promise<{ sex?: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-background" />}>
      <DemoInner searchParams={searchParams} />
    </Suspense>
  );
}
