"use client";

import { useState } from "react";
import { BRAND } from "@/lib/brand";
import type { GeneratedPlan } from "@/lib/llm/schema";
import type { CalcResult } from "@/lib/quiz/types";
import {
  aisleVisual,
  exerciseVisual,
  IconBubble,
  mealVisual,
  Ms,
} from "./Icon";
import { CalorieBar, MacroRing } from "./MacroRing";

const TABS = [
  { id: "overview", label: "Обзор", icon: "monitoring" },
  { id: "menu", label: "Меню", icon: "restaurant" },
  { id: "gym", label: "Зал", icon: "fitness_center" },
  { id: "shop", label: "Покупки", icon: "shopping_basket" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function PlanView({
  calc,
  plan,
  token,
}: {
  calc: CalcResult;
  plan: GeneratedPlan;
  token: string;
}) {
  const [tab, setTab] = useState<TabId>("overview");
  const [day, setDay] = useState(plan.menu[0]?.day ?? 1);
  const [bought, setBought] = useState<Record<string, boolean>>({});

  const current = plan.menu.find((d) => d.day === day) ?? plan.menu[0];
  const proteinKcal = calc.proteinG * 4;
  const fatKcal = calc.fatG * 9;
  const carbKcal = calc.carbG * 4;
  const macroSum = proteinKcal + fatKcal + carbKcal || 1;
  const afterKg = Math.max(40, Math.round((calc.weightKg - calc.forecastKg) * 10) / 10);

  return (
    <div className="mx-auto min-h-dvh max-w-[430px] px-4 pb-10 pt-5">
      <Hero calc={calc} afterKg={afterKg} />

      <div className="sticky top-0 z-20 -mx-4 mt-4 px-4 py-2">
        <div className="flex gap-1.5 rounded-full bg-white p-1 shadow-sm">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-1 rounded-full py-2.5 text-[12px] font-extrabold transition ${
                tab === t.id
                  ? "bg-linear-to-r from-[#FFB15A] to-[#FF6A1A] text-stone-950 shadow-[0_6px_16px_rgba(255,122,40,0.3)]"
                  : "text-stone-400"
              }`}
            >
              <Ms name={t.icon} size={16} fill={tab === t.id} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === "overview" && (
        <div className="mt-4 space-y-4">
          <section className="rounded-[28px] bg-white p-4 shadow-sm">
            <SectionTitle icon="donut_large" title="КБЖУ фазы" />
            <div className="mt-3 flex justify-around">
              <MacroRing
                label="Белок"
                value={`${calc.proteinG}`}
                unit="г"
                percent={proteinKcal / macroSum}
                color="#FF8A4C"
              />
              <MacroRing
                label="Жиры"
                value={`${calc.fatG}`}
                unit="г"
                percent={fatKcal / macroSum}
                color="#F59E0B"
              />
              <MacroRing
                label="Углеводы"
                value={`${calc.carbG}`}
                unit="г"
                percent={carbKcal / macroSum}
                color="#84CC16"
              />
            </div>
            <div className="mt-4">
              <CalorieBar diet={calc.dietCalories} maintenance={calc.maintenanceCalories} />
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <MiniStat icon="monitor_weight" label="Жир сейчас" value={`${calc.bodyFatPct}%`} />
            <MiniStat icon="accessibility_new" label="ОБМ" value={`${calc.lbmKg} кг`} />
            <MiniStat icon="local_fire_department" label="Дефицит" value={`${calc.deficit} ккал`} />
            <MiniStat icon="calendar_month" label="Фаза" value={`${calc.phaseDays} дн.`} />
          </div>

          <p className="rounded-[22px] bg-[#FEF6ED] px-4 py-3 text-[13px] leading-5 text-stone-600">
            {plan.summary}
          </p>

          {plan.refeedDays.length > 0 && (
            <section className="rounded-[28px] bg-white p-4 shadow-sm">
              <SectionTitle icon="bakery_dining" title="Рефиды" />
              <div className="mt-3 flex flex-wrap gap-1.5">
                {plan.menu.map((d) => (
                  <span
                    key={d.day}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-extrabold ${
                      d.isRefeed
                        ? "bg-linear-to-br from-[#FFB15A] to-[#FF6A1A] text-stone-950"
                        : "bg-[#F3E8DC] text-stone-400"
                    }`}
                  >
                    {d.day}
                  </span>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {plan.refeedDays.map((r) => (
                  <div key={r.day} className="rounded-2xl bg-[#FEF6ED] p-3">
                    <p className="text-sm font-extrabold">
                      День {r.day} · {r.carbsG} г углеводов
                    </p>
                    <p className="mt-1 text-[13px] leading-5 text-stone-500">
                      {r.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-[28px] bg-white p-4 shadow-sm">
            <SectionTitle icon="moving" title="Выход из диеты" />
            <p className="mt-2 text-sm text-stone-500">
              С {plan.exitPlan.startCalories} до {plan.exitPlan.targetCalories} ккал за{" "}
              {plan.exitPlan.days} дней.
            </p>
            <ol className="mt-3 space-y-2">
              {plan.exitPlan.steps.map((s, i) => (
                <li key={s} className="flex gap-3 text-[13px] leading-5 text-stone-600">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FEF6ED] text-[11px] font-extrabold text-brand-600">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </section>

          <Pills title="Добавки" icon="pill" items={plan.supplements} />
          <Pills title="Напоминания" icon="notifications" items={plan.tips} />
        </div>
      )}

      {tab === "menu" && current && (
        <div className="mt-4">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
            {plan.menu.map((d) => (
              <button
                key={d.day}
                type="button"
                onClick={() => setDay(d.day)}
                className={`flex h-14 w-12 shrink-0 flex-col items-center justify-center rounded-2xl text-[11px] font-extrabold ${
                  d.day === day
                    ? "bg-linear-to-b from-[#FFB15A] to-[#FF6A1A] text-stone-950"
                    : "bg-white text-stone-500 shadow-sm"
                }`}
              >
                <span className="text-[9px] opacity-70">день</span>
                {d.day}
                {d.isRefeed ? <span className="text-[10px]">🍯</span> : null}
              </button>
            ))}
          </div>
          {current.isRefeed ? (
            <p className="mb-3 rounded-2xl bg-[#FEF6ED] px-3 py-2 text-center text-[13px] font-semibold text-brand-700">
              🍯 Рефид — углеводы вокруг силовой
            </p>
          ) : null}
          <div className="space-y-3">
            {current.meals.map((meal, i) => {
              const v = mealVisual(meal.name, meal.ingredients);
              return (
                <article key={`${meal.name}-${i}`} className="rounded-[28px] bg-white p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <IconBubble name={v.icon} emoji={v.emoji} src={v.image} tint={v.tint} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-400">
                        Приём {i + 1}
                        {meal.notes ? ` · ${meal.notes}` : ""}
                      </p>
                      <p className="mt-0.5 text-[16px] font-extrabold leading-5">{meal.name}</p>
                    </div>
                    <span className="rounded-full bg-[#FEF6ED] px-2.5 py-1 text-[11px] font-extrabold text-brand-700">
                      {meal.proteinG} г Б
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {meal.ingredients.map((ing, j) => (
                      <span
                        key={`${ing}-${j}`}
                        className="rounded-full bg-[#F7F0E8] px-2.5 py-1 text-[12px] text-stone-600"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {tab === "gym" && (
        <div className="mt-4 space-y-4">
          {plan.workouts.map((w) => (
            <section key={w.name} className="rounded-[28px] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <IconBubble
                  name="fitness_center"
                  emoji="🏋️"
                  tint="#FF6A1A"
                  src={`/plan/ex/${calc.sex}/gym.png`}
                />
                <div>
                  <p className="text-[17px] font-extrabold">{w.name}</p>
                  <p className="text-[12px] leading-4 text-stone-400">{w.when}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {w.exercises.map((ex, i) => {
                  const v = exerciseVisual(ex.name, calc.sex);
                  return (
                    <li
                      key={`${ex.name}-${i}`}
                      className="flex items-center gap-3 rounded-2xl bg-[#FEF6ED] p-2.5"
                    >
                      <IconBubble
                        name={v.icon}
                        emoji={v.emoji}
                        src={v.image}
                        tint={v.tint}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] font-extrabold leading-4">{ex.name}</p>
                        <p className="mt-0.5 text-[11px] text-stone-400">
                          {ex.sets} подходов
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-2.5 py-1 text-[12px] font-extrabold text-brand-700">
                        {ex.reps}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}

      {tab === "shop" && (
        <div className="mt-4 space-y-3">
          {plan.shoppingList.map((item) => {
            const food = mealVisual(item.item);
            const aisle = aisleVisual(item.aisle);
            const v = food.image?.endsWith("meal.png") ? aisle : food;
            const on = bought[item.item];
            return (
              <button
                key={item.item}
                type="button"
                onClick={() =>
                  setBought((prev) => ({ ...prev, [item.item]: !prev[item.item] }))
                }
                className={`flex w-full items-center gap-3 rounded-[22px] bg-white p-3 text-left shadow-sm ${
                  on ? "opacity-50" : ""
                }`}
              >
                <IconBubble
                  name={v.icon}
                  emoji={v.emoji}
                  src={"image" in v ? v.image : undefined}
                  tint={v.tint}
                  size="sm"
                />
                <span className={`flex-1 text-[15px] font-semibold ${on ? "line-through" : ""}`}>
                  {item.item}
                </span>
                <span className="text-[12px] font-semibold text-stone-400">{item.amount}</span>
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full ${
                    on ? "bg-brand-500 text-white" : "border-2 border-stone-200"
                  }`}
                >
                  {on ? <Ms name="check" size={16} /> : null}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <a
        href={`/api/plan/${token}/pdf`}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#FFB15A] via-[#FF8A3D] to-[#FF6A1A] py-[18px] text-[16px] font-extrabold text-stone-950 shadow-[0_8px_24px_rgba(255,122,40,0.35)]"
      >
        <Ms name="picture_as_pdf" />
        Скачать PDF
      </a>
      <p className="mt-6 text-center text-[11px] leading-5 text-stone-400">
        Материал носит информационный характер и не является медицинской
        рекомендацией. Перед жёстким дефицитом проконсультируйтесь с врачом.
      </p>
    </div>
  );
}

function Hero({ calc, afterKg }: { calc: CalcResult; afterKg: number }) {
  const progress = Math.min(92, Math.round((calc.forecastKg / Math.max(calc.weightKg, 1)) * 100) + 38);
  return (
    <section className="relative overflow-hidden rounded-[32px] bg-linear-to-br from-[#FF8A3D] to-[#FF5C1A] p-5 text-white shadow-[0_16px_40px_rgba(255,92,26,0.28)]">
      <div className="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15" />
      <div className="pointer-events-none absolute -bottom-12 left-10 h-28 w-28 rounded-full bg-black/10" />
      <div className="relative">
        <p className="text-[13px] font-extrabold tracking-wide text-white/80">
          {BRAND.name} · персональный план
        </p>
        <h1 className="mt-2 text-[28px] font-extrabold leading-8 tracking-tight">
          {BRAND.tagline}
        </h1>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-[12px] font-semibold text-white/75">Прогноз жира</p>
            <p className="text-[48px] font-extrabold leading-none tracking-tight">
              −{calc.forecastKg}
              <span className="text-[22px]"> кг</span>
            </p>
            <p className="mt-1 text-sm text-white/85">за {calc.forecastWeeks} нед.</p>
          </div>
          <div className="rounded-3xl bg-white/15 px-3 py-3 text-center">
            <p className="text-[11px] text-white/70">вес</p>
            <p className="font-extrabold">
              {calc.weightKg} → {afterKg}
            </p>
            <p className="text-[11px] text-white/70">кг</p>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-[12px] leading-4 text-white/85">{calc.forecastLabel}</p>
      </div>
    </section>
  );
}

function SectionTitle({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <Ms name={icon} className="text-brand-600" />
      <h2 className="text-[17px] font-extrabold">{title}</h2>
    </div>
  );
}

function MiniStat({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[24px] bg-white p-4 shadow-sm">
      <Ms name={icon} className="text-brand-500" size={22} />
      <p className="mt-2 text-[11px] font-semibold text-stone-400">{label}</p>
      <p className="text-[18px] font-extrabold">{value}</p>
    </div>
  );
}

function Pills({
  title,
  icon,
  items,
}: {
  title: string;
  icon: string;
  items: string[];
}) {
  return (
    <section className="rounded-[28px] bg-white p-4 shadow-sm">
      <SectionTitle icon={icon} title={title} />
      <ul className="mt-3 space-y-2">
        {items.map((s) => (
          <li
            key={s}
            className="flex gap-2 rounded-2xl bg-[#FEF6ED] px-3 py-2.5 text-[13px] leading-5 text-stone-600"
          >
            <Ms name="check_circle" size={18} className="mt-0.5 shrink-0 text-brand-500" />
            {s}
          </li>
        ))}
      </ul>
    </section>
  );
}
