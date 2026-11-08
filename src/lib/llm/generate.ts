import { FORBIDDEN_SUPPLEMENTS } from "@/lib/psmf/config";
import type { CalcResult, QuizAnswers } from "@/lib/quiz/types";
import { fallbackPlan } from "./fallback";
import { planSchema, type GeneratedPlan } from "./schema";

function stripForbidden(plan: GeneratedPlan): GeneratedPlan {
  const banned = (text: string) =>
    FORBIDDEN_SUPPLEMENTS.some((w) => text.toLowerCase().includes(w));
  return {
    ...plan,
    tips: plan.tips.filter((t) => !banned(t)),
    supplements: plan.supplements.filter((t) => !banned(t)),
  };
}

export async function generatePlan(
  calc: CalcResult,
  answers: QuizAnswers,
): Promise<GeneratedPlan> {
  const apiKey = process.env.LLM_API_KEY;
  const apiUrl = process.env.LLM_API_URL ?? "https://api.openai.com/v1/chat/completions";
  const model = process.env.LLM_MODEL ?? "gpt-4o-mini";

  if (!apiKey) {
    return stripForbidden(fallbackPlan(calc, answers));
  }

  const system = `Ты нутрициолог-методист. Составь персональный 14-дневный план питания и тренировок.
Цифры КБЖУ, длительность фазы и рефиды УЖЕ посчитаны — не меняй их.
Верни ТОЛЬКО JSON по схеме.
Запрещено рекомендовать эфедрин, кленбутерол, йохимбин и любые фармпрепараты для похудения.
Разрешены только мультивитамины, омега-3 и креатин.
Меню из простых продуктов магазина «${answers.store}», уложиться примерно в ${answers.budget} ₽/неделю.
Зал пользователя: ${answers.gym}. Тренировки под этот зал (или дом, если зала нет).
Учитывай стоп-лист и аллергии. Блюда — из понравившихся продуктов.
Тренировки: 6–10 повторений, 2–3 рабочих подхода, без суперсетов и HIIT.
Это не медицинская рекомендация.`;

  const user = JSON.stringify({ calc, answers }, null, 2);

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
    if (!res.ok) {
      throw new Error(`LLM ${res.status}`);
    }
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) throw new Error("empty llm");
    const parsed = planSchema.parse(JSON.parse(raw));
    return stripForbidden(parsed);
  } catch {
    return stripForbidden(fallbackPlan(calc, answers));
  }
}
