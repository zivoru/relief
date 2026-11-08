import { BRAND } from "@/lib/brand";
import type { GeneratedPlan } from "@/lib/llm/schema";
import type { CalcResult } from "@/lib/quiz/types";

export function PlanView({
  calc,
  plan,
  token,
}: {
  calc: CalcResult;
  plan: GeneratedPlan;
  token: string;
}) {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <p className="text-[22px] font-extrabold text-brand-600">{BRAND.name}</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
        {BRAND.tagline}
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone-600">{plan.summary}</p>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Stat label="Жир" value={`${calc.bodyFatPct}%`} />
        <Stat label="ОБМ" value={`${calc.lbmKg} кг`} />
        <Stat label="Белок" value={`${calc.proteinG} г`} />
        <Stat label="Ккал фазы" value={`${calc.dietCalories}`} />
      </div>
      <p className="mt-3 text-sm text-stone-500">{calc.phaseLabel}</p>

      <a
        href={`/api/plan/${token}/pdf`}
        className="mt-6 flex w-full items-center justify-center rounded-full bg-linear-to-r from-brand-500 to-brand-600 py-4 font-semibold text-stone-950"
      >
        Скачать PDF
      </a>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Меню на 14 дней</h2>
        <div className="mt-4 space-y-4">
          {plan.menu.map((day) => (
            <article key={day.day} className="rounded-2xl bg-white p-4">
              <p className="font-medium">
                День {day.day}
                {day.isRefeed ? " · рефид" : ""}
              </p>
              <ul className="mt-2 space-y-2 text-sm text-stone-600">
                {day.meals.map((meal) => (
                  <li key={meal.name}>
                    <span className="font-medium text-stone-800">{meal.name}</span>
                    {" · "}
                    {meal.proteinG} г белка
                    <div className="text-stone-400">{meal.ingredients.join(", ")}</div>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {plan.refeedDays.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Рефиды</h2>
          <div className="mt-3 space-y-3">
            {plan.refeedDays.map((r) => (
              <div key={r.day} className="rounded-2xl bg-white p-4 text-sm">
                <p className="font-medium">
                  День {r.day}: {r.carbsG} г углеводов
                </p>
                <p className="mt-1 text-stone-500">{r.instruction}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Список покупок</h2>
        <ul className="mt-3 space-y-2 rounded-2xl bg-white p-4 text-sm">
          {plan.shoppingList.map((item) => (
            <li key={item.item} className="flex justify-between gap-4">
              <span>{item.item}</span>
              <span className="text-stone-400">{item.amount}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Тренировки</h2>
        {plan.workouts.map((w) => (
          <div key={w.name} className="mt-3 rounded-2xl bg-white p-4">
            <p className="font-medium">{w.name}</p>
            <p className="mt-1 text-sm text-stone-500">{w.when}</p>
            <ul className="mt-2 space-y-1 text-sm text-stone-600">
              {w.exercises.map((ex) => (
                <li key={ex.name}>
                  {ex.name}: {ex.sets} × {ex.reps}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Выход из диеты</h2>
        <p className="mt-2 text-sm text-stone-500">
          С {plan.exitPlan.startCalories} до {plan.exitPlan.targetCalories} ккал за{" "}
          {plan.exitPlan.days} дней.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-stone-600">
          {plan.exitPlan.steps.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Добавки</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-600">
          {plan.supplements.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold">Напоминания</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-stone-600">
          {plan.tips.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-xs leading-5 text-stone-400">
        Материал носит информационный характер и не является медицинской
        рекомендацией. Перед жёстким дефицитом проконсультируйтесь с врачом.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white p-4">
      <p className="text-xs text-stone-400">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}
