"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ms } from "@/components/plan/Icon";
import { BodyFatCard } from "@/components/quiz/BodyFatCard";
import { TasteCard, preloadTastePhoto } from "@/components/quiz/TasteCard";
import {
  ArrowIcon2,
  Choice,
  FancySlider,
  LogoTile,
  NextBar,
  QuizHeader,
  Shell,
  Title,
} from "@/components/quiz/ui";
import { trackGoal } from "@/lib/analytics";
import { BRAND } from "@/lib/brand";
import { PRODUCT, SELLER, sellerLine } from "@/lib/legal";
import { wantsSkipPaywall } from "@/lib/paywall";
import {
  ALLERGENS,
  BODY_FAT_OPTIONS,
  FOOD_CARDS,
  GOALS,
  GYMS,
  SCREENING_FLAGS,
  STORES,
  activityFromGym,
} from "@/lib/psmf/config";
import type { CalcResult, QuizAnswers } from "@/lib/quiz/types";

type StepId =
  | "gym"
  | "goal"
  | "sex"
  | "metrics"
  | "figure"
  | "steps"
  | "experience"
  | "tastes"
  | "allergens"
  | "store"
  | "budget"
  | "screening";

const ALL_STEPS: {
  id: StepId;
  enabled: boolean;
  label: string;
  title: string;
  subtitle?: string;
}[] = [
  {
    id: "gym",
    enabled: true,
    label: "Зал",
    title: "Где тренируешься?",
    subtitle: "Под это соберём силовые. Можно отметить один зал.",
  },
  {
    id: "goal",
    enabled: false,
    label: "Срок",
    title: "К какому сроку?",
    subtitle: "Под это подберём длительность фазы.",
  },
  {
    id: "sex",
    enabled: true,
    label: "Пол",
    title: "Какой у тебя пол?",
    subtitle: "Нужен для расчёта дневной нормы калорий.",
  },
  {
    id: "metrics",
    enabled: true,
    label: "Замеры",
    title: "Возраст, рост и вес",
  },
  {
    id: "figure",
    enabled: true,
    label: "Фигура",
    title: "Как выглядит фигура?",
    subtitle: "Выбери ближайший вариант — так оценим процент жира.",
  },
  {
    id: "steps",
    enabled: true,
    label: "Шаги",
    title: "Сколько шагов в день?",
    subtitle: "Это входит в калории поддержки.",
  },
  {
    id: "experience",
    enabled: true,
    label: "Опыт",
    title: "Какой опыт тренировок?",
    subtitle: "Без силовых сушка повышает риск потери мышц.",
  },
  {
    id: "tastes",
    enabled: true,
    label: "Вкусы",
    title: "Что тебе нравится?",
    subtitle: "Свайпни вправо — нравится, влево — нет. Так соберём вкусовую карту.",
  },
  {
    id: "allergens",
    enabled: false,
    label: "Аллергии",
    title: "Аллергии и ограничения",
    subtitle: "Отметь всё, что не должно попасть в меню.",
  },
  {
    id: "store",
    enabled: false,
    label: "Магазин",
    title: "Где покупаешь продукты?",
    subtitle: "Соберём меню из того, что есть на полках.",
  },
  {
    id: "budget",
    enabled: false,
    label: "Бюджет",
    title: "Бюджет на неделю",
    subtitle: "Не будем предлагать то, что в него не влезет.",
  },
  {
    id: "screening",
    enabled: true,
    label: "Ограничения",
    title: "Важные ограничения",
    subtitle:
      "Если отметишь любой пункт, дадим мягкий дефицит 20% вместо жёсткой фазы.",
  },
];

const STEPS = ALL_STEPS.filter((step) => step.enabled);
const TOTAL = STEPS.length;

const defaultAnswers: QuizAnswers = {
  gym: "ddx",
  goal: "",
  sex: "female",
  age: 28,
  heightCm: 168,
  weightKg: 72,
  bodyFatPct: 0,
  steps: 7000,
  activity: "gym",
  experience: "novice",
  likedFoods: [],
  dislikedFoods: [],
  allergens: [],
  stopList: [],
  store: "Пятёрочка",
  budget: 5600,
  screening: [],
};

type Screen = "landing" | "quiz" | "loading" | "pay" | "error";

const SWIPE_MS = 280;
const SWIPE_THRESHOLD = 90;
const TASTES_DONE_MS = 500;

function utmFromLocation(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const keys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const out: Record<string, string> = {};
  for (const k of keys) {
    const v = p.get(k);
    if (v) out[k] = v;
  }
  return out;
}

export function QuizApp() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>(defaultAnswers);
  const [foodIndex, setFoodIndex] = useState(0);
  const [swipe, setSwipe] = useState<"left" | "right" | null>(null);
  const [returning, setReturning] = useState<"left" | "right" | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<number | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [stopInput, setStopInput] = useState("");
  const [email, setEmail] = useState("");
  const [consentPd, setConsentPd] = useState(false);
  const [consentHealth, setConsentHealth] = useState(false);
  const [calc, setCalc] = useState<CalcResult | null>(null);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [amountRub, setAmountRub] = useState("390.00");
  const [busy, setBusy] = useState(false);
  const [loadTick, setLoadTick] = useState(0);
  const [editingBudget, setEditingBudget] = useState(false);
  const [editingSteps, setEditingSteps] = useState(false);

  useEffect(() => {
    if (screen !== "pay") return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.background;
    const prevBody = body.style.background;
    const fill = "linear-gradient(to bottom, #FF8A3D, #FF5C1A)";
    html.style.background = fill;
    body.style.background = fill;
    return () => {
      html.style.background = prevHtml;
      body.style.background = prevBody;
    };
  }, [screen]);

  useEffect(() => {
    for (const f of FOOD_CARDS.slice(foodIndex, foodIndex + 3)) preloadTastePhoto(f.id);
  }, [foodIndex]);

  const fatOptions = BODY_FAT_OPTIONS[answers.sex];
  const food = FOOD_CARDS[foodIndex];
  const gymName = GYMS.find((g) => g.id === answers.gym)?.name ?? "";

  const current = STEPS[step - 1];
  const isLast = step === TOTAL;

  const canNext = useMemo(() => {
    const id = STEPS[step - 1]?.id;
    if (id === "gym") return Boolean(answers.gym);
    if (id === "goal") return Boolean(answers.goal);
    if (id === "figure") return answers.bodyFatPct > 0;
    if (id === "store") return Boolean(answers.store);
    return true;
  }, [answers, step]);

  function patch(partial: Partial<QuizAnswers>) {
    setAnswers((prev) => ({ ...prev, ...partial }));
  }

  function swipeFood(dir: "left" | "right") {
    if (swipe || !food) return;
    const id = food.id;
    setSwipe(dir);
    setTimeout(() => {
      setAnswers((prev) =>
        dir === "right"
          ? { ...prev, likedFoods: [...prev.likedFoods, id] }
          : { ...prev, dislikedFoods: [...prev.dislikedFoods, id] },
      );
      setFoodIndex((i) => i + 1);
      setSwipe(null);
      if (foodIndex === FOOD_CARDS.length - 1) {
        advanceTimer.current = setTimeout(() => {
          trackGoal("quiz_step_tastes");
          setStep((s) => s + 1);
        }, TASTES_DONE_MS);
      }
    }, SWIPE_MS);
  }

  function endDrag() {
    if (dragStart.current === null) return;
    dragStart.current = null;
    setDragging(false);
    if (Math.abs(dragX) > SWIPE_THRESHOLD) swipeFood(dragX > 0 ? "right" : "left");
    setDragX(0);
  }

  function undoFood() {
    if (swipe || foodIndex === 0) return;
    clearTimeout(advanceTimer.current);
    const prevId = FOOD_CARDS[foodIndex - 1].id;
    setReturning(answers.likedFoods.includes(prevId) ? "right" : "left");
    setAnswers((prev) => ({
      ...prev,
      likedFoods: prev.likedFoods.filter((x) => x !== prevId),
      dislikedFoods: prev.dislikedFoods.filter((x) => x !== prevId),
    }));
    setFoodIndex((i) => i - 1);
  }

  function restartTastes() {
    patch({ likedFoods: [], dislikedFoods: [] });
    setFoodIndex(0);
  }

  function toggle(list: string[], id: string): string[] {
    return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  }

  function back() {
    clearTimeout(advanceTimer.current);
    if (step === 1) setScreen("landing");
    else setStep((s) => s - 1);
  }

  async function finishQuiz() {
    setScreen("loading");
    setLoadTick(0);
    const timers = [400, 900, 1400, 1900];
    timers.forEach((t, i) => setTimeout(() => setLoadTick(i + 1), t));
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          utm: utmFromLocation(),
          skipPaywall: wantsSkipPaywall(),
        }),
      });
      if (!res.ok) throw new Error("quiz failed");
      const data = (await res.json()) as {
        calc: CalcResult;
        orderId: number;
        amountRub: string;
        token?: string;
        skipPaywall?: boolean;
      };
      setCalc(data.calc);
      setOrderId(data.orderId);
      setAmountRub(data.amountRub);
      trackGoal("quiz_complete", { category: data.calc.category });
      setTimeout(() => {
        if (data.skipPaywall && data.token) {
          window.location.href = `/pay/success?invId=${data.orderId}&token=${data.token}`;
          return;
        }
        setScreen("pay");
      }, 2200);
    } catch {
      setScreen("error");
    }
  }

  async function checkout() {
    if (!orderId) return;
    setBusy(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          email,
          consentPd,
          consentHealth,
        }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "pay");
      trackGoal("checkout_start");
      window.location.href = data.url;
    } catch {
      setBusy(false);
      setScreen("error");
    }
  }

  if (screen === "landing") {
    return (
      <Shell>
        <p className="mt-8 text-center text-[40px] font-extrabold tracking-tight text-brand-600">
          {BRAND.name}
        </p>
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-brand-500" />
        <h1 className="mt-8 text-center text-[28px] font-extrabold leading-8 tracking-tight">
          Сушка без потери мышц — по готовому плану
        </h1>
        <p className="mt-3 text-center text-[15px] leading-6 text-stone-500">
          Индивидуальный план похудения — чтобы уходил жир, а
          мышцы оставались
        </p>
        <div className="mt-8 rounded-[28px] bg-white p-5 shadow-sm">
          <LandingStep n={1} icon="🏋️" title="Выбери зал, фигуру и вкусы">
            <div className="mt-2 flex gap-1.5">
              {GYMS.slice(0, 7).map((g) => (
                <span
                  key={g.id}
                  className="flex h-6 w-6 items-center justify-center overflow-hidden bg-white"
                  style={{ background: "logo" in g && g.logo ? "#fff" : g.color }}
                >
                  {"logo" in g && g.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.logo} alt="" className="h-5 w-5 object-contain" />
                  ) : (
                    <span className="text-[8px] font-extrabold text-white">
                      {g.letters.slice(0, 2)}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </LandingStep>
          <LandingStep n={2} icon="🥗" title="Получи план на 14 дней">
            <p className="mt-1 text-[13px] text-stone-400">
              Белок, меню, рефиды и тренировки под твою норму.
            </p>
          </LandingStep>
          <LandingStep n={3} icon="📋" title="Сохрани мышцы, пока уходит жир">
            <p className="mt-1 text-[13px] text-stone-400">
              Цифры считает калькулятор, меню собирает нейросеть.
            </p>
          </LandingStep>
        </div>
        <p className="mt-8 text-center text-xs leading-5 text-stone-400">
          <Link href="/offer" className="underline">
            Оферта
          </Link>
          {" · "}
          <Link href="/refund" className="underline">
            Возврат
          </Link>
          {" · "}
          <Link href="/privacy" className="underline">
            Политика ПДн
          </Link>
          {" · "}
          <Link href="/contacts" className="underline">
            Контакты
          </Link>
        </p>
        <NextBar
          label={BRAND.cta}
          onNext={() => {
            trackGoal("quiz_start");
            setScreen("quiz");
          }}
        />
      </Shell>
    );
  }

  if (screen === "loading") {
    const items = [
      "Сверяем твои настройки",
      "Считаем белок и фазу",
      "Подбираем блюда под зал",
      "План готов",
    ];
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center pt-16">
          <div className="mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-3xl shadow-[0_0_40px_rgba(255,122,40,0.45)]">
            🥗
          </div>
          <h1 className="text-[26px] font-extrabold">Собираем план…</h1>
          <p className="mt-2 text-sm text-stone-500">Подбираем блюда под твой бюджет</p>
          <div className="mt-8 w-full divide-y divide-stone-100 rounded-[24px] bg-white px-5 py-2 shadow-sm">
            {items.map((item, i) => (
              <div key={item} className="flex items-center gap-3 py-3.5 text-[15px]">
                <StatusDot done={loadTick > i} current={loadTick === i} />
                <span
                  className={
                    loadTick > i
                      ? "font-semibold text-stone-800"
                      : loadTick === i
                        ? "font-semibold text-brand-600"
                        : "text-stone-400"
                  }
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    );
  }

  if (screen === "error") {
    return (
      <Shell>
        <Title title="Что-то пошло не так" subtitle="Попробуй ещё раз — ответы сохранились." />
        <NextBar label="Вернуться" onNext={() => setScreen("quiz")} />
      </Shell>
    );
  }

  if (screen === "pay" && calc) {
    const price = Number(amountRub).toLocaleString("ru-RU");
    return (
      <div className="fixed inset-0 z-30 min-h-dvh overflow-y-auto bg-linear-to-b from-[#FF8A3D] to-[#FF5C1A] text-white">
        <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-10 pt-4">
          <div className="flex items-center gap-3 rounded-full bg-white/15 px-2 py-2">
            <button
              type="button"
              onClick={() => setScreen("quiz")}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-stone-800"
            >
              <ArrowIcon2 className="rotate-180" />
            </button>
            <div className="flex-1 pr-11 text-center">
              <p className="text-lg font-extrabold">{BRAND.name}</p>
              <p className="text-[10px] tracking-[0.2em] text-white/80">ПЛАН</p>
            </div>
          </div>
          <div className="mt-8 flex flex-1 flex-col items-center text-center">
            <h1 className="text-[32px] font-extrabold leading-9">
              План собран.
              <br />
              Забери его сейчас
            </h1>
            <p className="mt-3 text-[15px] text-white/85">
              Разовая оплата — без подписки и обязательств.
            </p>
            <div className="mt-8 w-full rounded-[28px] bg-white/15 p-4 text-left">
              <p className="px-1 font-extrabold">⭐️ {PRODUCT.name}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  { icon: "restaurant", label: "Меню 14 дней" },
                  { icon: "fitness_center", label: `Зал: ${gymName || "твой"}` },
                  { icon: "shopping_basket", label: "Список покупок" },
                  { icon: "monitoring", label: "КБЖУ и рефиды" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 rounded-2xl bg-white/10 px-3 py-2.5"
                  >
                    <Ms name={item.icon} size={18} />
                    <span className="text-[12px] font-semibold leading-4">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 px-1 text-sm font-semibold">
                {price} ₽ разово · {PRODUCT.paymentType}
              </p>
              <p className="mt-2 px-1 text-[12px] leading-5 text-white/75">
                {PRODUCT.delivery}
              </p>
            </div>

            {/* <div className="mt-3 w-full rounded-[28px] bg-white/15 p-4 text-left text-[12px] leading-5 text-white/85">
              <p className="text-[13px] font-extrabold text-white">Продавец</p>
              <p className="mt-1">{sellerLine()}</p>
              <p>
                {SELLER.country}, {SELLER.city}
              </p>
              <p className="mt-2">
                <a className="underline" href={`mailto:${SELLER.email}`}>
                  {SELLER.email}
                </a>
                {" · "}
                <a className="underline" href={SELLER.phoneHref}>
                  {SELLER.phone}
                </a>
              </p>
              <p className="mt-3 text-white/75">
                Возврат до выдачи доступа — полный. После открытия плана услуга
                оказана; возврат при техническом сбое — по правилам на странице{" "}
                <Link className="underline" href="/refund">
                  «Возврат»
                </Link>
                .
              </p>
              <p className="mt-2 text-[11px] text-white/65">{PRODUCT.disclaimer}</p>
            </div> */}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email для ссылки на план"
              className="mt-6 w-full rounded-2xl border-0 bg-white px-4 py-4 text-stone-900 outline-none"
            />
            <div className="mt-4 w-full space-y-3 text-left">
              <PayCheck
                checked={consentPd}
                onChange={setConsentPd}
              >
                Соглашаюсь с{" "}
                <Link className="underline" href="/privacy">
                  политикой ПДн
                </Link>
                ,{" "}
                <Link className="underline" href="/offer">
                  офертой
                </Link>{" "}
                и{" "}
                <Link className="underline" href="/refund">
                  условиями возврата
                </Link>
              </PayCheck>
              <PayCheck
                checked={consentHealth}
                onChange={setConsentHealth}
              >
                Даю согласие на обработку данных о здоровье только для расчёта плана.
              </PayCheck>
            </div>
          </div>
          <button
            type="button"
            disabled={busy || !email.includes("@") || !consentPd || !consentHealth}
            onClick={checkout}
            className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white py-[18px] text-[17px] font-extrabold text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? "Переходим к оплате…" : `Получить за ${price} ₽`}
          </button>
          <p className="mt-3 text-center text-xs text-white/80">
            СБП, T-Pay, любые карты ·{" "}
            <Link className="underline" href="/contacts">
              Контакты
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Shell>
      <QuizHeader step={step} total={TOTAL} label={current.label} onBack={back} />
      <Title title={current.title} subtitle={current.subtitle} />

      {current.id === "gym" && (
        <div className="grid grid-cols-3 gap-2.5">
          {GYMS.map((gym) => (
            <LogoTile
              key={gym.id}
              name={gym.name}
              letters={gym.letters}
              color={gym.color}
              logo={"logo" in gym ? gym.logo : undefined}
              active={answers.gym === gym.id}
              onClick={() =>
                patch({ gym: gym.id, activity: activityFromGym(gym.id) })
              }
            />
          ))}
        </div>
      )}

      {current.id === "goal" && (
        <div className="space-y-3">
            {GOALS.map((g) => (
              <Choice
                key={g.id}
                active={answers.goal === g.id}
                onClick={() => patch({ goal: g.id })}
              >
                <span className="mr-2 text-xl">{g.emoji}</span>
                {g.label}
              </Choice>
            ))}
        </div>
      )}

      {current.id === "sex" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => patch({ sex: "female", bodyFatPct: 0 })}
            className={`cursor-pointer rounded-[24px] border bg-white py-8 text-center shadow-sm ${
              answers.sex === "female"
                ? "border-brand-500 bg-orange-50"
                : "border-transparent"
            }`}
          >
            <p className="text-4xl">👩</p>
            <p
              className={`mt-3 font-extrabold ${
                answers.sex === "female" ? "text-brand-600" : "text-stone-800"
              }`}
            >
              Женский
            </p>
          </button>
          <button
            type="button"
            onClick={() => patch({ sex: "male", bodyFatPct: 0 })}
            className={`cursor-pointer rounded-[24px] border bg-white py-8 text-center shadow-sm ${
              answers.sex === "male"
                ? "border-brand-500 bg-orange-50"
                : "border-transparent"
            }`}
          >
            <p className="text-4xl">👨</p>
            <p
              className={`mt-3 font-extrabold ${
                answers.sex === "male" ? "text-brand-600" : "text-stone-800"
              }`}
            >
              Мужской
            </p>
          </button>
        </div>
      )}

      {current.id === "metrics" && (
        <div className="space-y-8">
          <MetricField
            label="Возраст"
            unit="лет"
            value={answers.age}
            min={18}
            max={70}
            onChange={(age) => patch({ age })}
          />
          <MetricField
            label="Рост"
            unit="см"
            value={answers.heightCm}
            min={140}
            max={210}
            onChange={(heightCm) => patch({ heightCm })}
          />
          <MetricField
            label="Вес"
            unit="кг"
            value={answers.weightKg}
            min={40}
            max={180}
            onChange={(weightKg) => patch({ weightKg })}
          />
        </div>
      )}

      {current.id === "figure" && (
        <div className="grid grid-cols-4 gap-2">
          {fatOptions.map((pct) => (
            <BodyFatCard
              key={pct}
              sex={answers.sex}
              pct={pct}
              selected={answers.bodyFatPct === pct}
              onSelect={() => patch({ bodyFatPct: pct })}
            />
          ))}
        </div>
      )}

      {current.id === "steps" && (
        <StepsStep
          steps={answers.steps}
          editing={editingSteps}
          onEdit={() => setEditingSteps(true)}
          onChange={(steps) => patch({ steps })}
          onCommit={() => setEditingSteps(false)}
        />
      )}

      {current.id === "experience" && (
        <div className="space-y-3">
          <Choice
            active={answers.experience === "novice"}
            onClick={() => patch({ experience: "novice" })}
          >
            <span className="mr-2 text-xl">🌱</span>
            Новичок
          </Choice>
          <Choice
            active={answers.experience === "trained"}
            onClick={() => patch({ experience: "trained" })}
          >
            <span className="mr-2 text-xl">💪</span>
            Тренируюсь давно
          </Choice>
        </div>
      )}

      {current.id === "tastes" && !food && (
        <div className="-mx-5 overflow-x-clip px-5">
          <div className="flex h-72 animate-[card-in_260ms_ease-out] flex-col items-center justify-center rounded-[28px] bg-white px-6 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <Ms name="check_circle" rounded size={40} />
            </span>
            <p className="mt-4 text-[22px] font-extrabold leading-7">
              Вкусовая карта готова
            </p>
            <p className="mt-2 text-[14px] leading-5 text-stone-500">
              Нравится: {answers.likedFoods.length} · Не нравится:{" "}
              {answers.dislikedFoods.length}
              <br />
              Соберём меню только из того, что ты ешь.
            </p>
          </div>
          <div className="mt-4 flex justify-center gap-5">
            <button
              type="button"
              onClick={undoFood}
              className="flex items-center gap-1 text-[13px] font-semibold text-stone-400"
            >
              <Ms name="undo" rounded size={16} />
              Предыдущий продукт
            </button>
            <button
              type="button"
              onClick={() => {
                clearTimeout(advanceTimer.current);
                restartTastes();
              }}
              className="flex items-center gap-1 text-[13px] font-semibold text-stone-400"
            >
              <Ms name="replay" rounded size={16} />
              Пройти заново
            </button>
          </div>
        </div>
      )}

      {current.id === "tastes" && food && (
        <>
          <div className="-mx-5 overflow-x-clip px-5">
            <div
              key={food.id}
              onAnimationEnd={() => setReturning(null)}
              onPointerDown={(e) => {
                if (swipe) return;
                dragStart.current = e.clientX;
                setDragging(true);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                if (dragStart.current === null) return;
                setDragX(e.clientX - dragStart.current);
              }}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              style={{
                transform:
                  swipe === "left"
                    ? "translateX(-130%) rotate(-14deg)"
                    : swipe === "right"
                      ? "translateX(130%) rotate(14deg)"
                      : dragX
                        ? `translateX(${dragX}px) rotate(${dragX / 18}deg)`
                        : undefined,
                opacity: swipe ? 0 : 1,
                transition: swipe
                  ? `transform ${SWIPE_MS}ms ease-in, opacity ${SWIPE_MS}ms ease-in`
                  : dragging
                    ? "none"
                    : "transform 220ms ease-out",
                touchAction: "pan-y",
              }}
              className={`relative select-none ${dragging ? "cursor-grabbing" : "cursor-grab"} ${
                swipe
                  ? ""
                  : returning === "left"
                    ? "animate-[card-back-left_320ms_cubic-bezier(.2,.9,.3,1.1)]"
                    : returning === "right"
                      ? "animate-[card-back-right_320ms_cubic-bezier(.2,.9,.3,1.1)]"
                      : "animate-[card-in_220ms_ease-out]"
              }`}
            >
              <TasteCard id={food.id} name={food.name} kcal={food.kcal} tag={food.tag} />
              <span
                className="pointer-events-none absolute left-4 top-4 -rotate-12 rounded-xl border-[3px] border-white bg-stone-900/40 px-3 py-1 text-[18px] font-extrabold text-white backdrop-blur-sm"
                style={{ opacity: swipe === "left" ? 1 : Math.min(1, Math.max(0, -dragX / SWIPE_THRESHOLD)) }}
              >
                НЕ ЕМ
              </span>
              <span
                className="pointer-events-none absolute right-4 top-4 rotate-12 rounded-xl border-[3px] border-white bg-brand-500/80 px-3 py-1 text-[18px] font-extrabold text-white backdrop-blur-sm"
                style={{ opacity: swipe === "right" ? 1 : Math.min(1, Math.max(0, dragX / SWIPE_THRESHOLD)) }}
              >
                ХОЧУ
              </span>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-5">
            <button
              type="button"
              aria-label="Предыдущий продукт"
              disabled={foodIndex === 0}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white text-stone-400 shadow-sm transition active:scale-90 disabled:opacity-0"
              onClick={undoFood}
            >
              <Ms name="undo" rounded size={22} />
            </button>
            <button
              type="button"
              disabled={Boolean(swipe)}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-white text-xl shadow-sm transition active:scale-90 disabled:cursor-pointer"
              onClick={() => swipeFood("left")}
            >
              <Ms name="close" rounded weight={500} size={28} className="text-stone-500" />
            </button>
            <button
              type="button"
              disabled={Boolean(swipe)}
              className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-brand-500 text-xl text-white shadow-[0_8px_20px_rgba(255,138,76,0.45)] transition active:scale-90 disabled:cursor-pointer"
              onClick={() => swipeFood("right")}
            >
              <Ms name="favorite" rounded size={28} className="translate-y-[2px]" />
            </button>
            <span className="h-11 w-11" aria-hidden />
          </div>
          <p className="mt-3 text-center text-xs text-stone-400">
            {foodIndex + 1} из {FOOD_CARDS.length}
          </p>
        </>
      )}

      {current.id === "allergens" && (
        <>
          <div className="grid grid-cols-4 gap-2">
            {ALLERGENS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => patch({ allergens: toggle(answers.allergens, a.id) })}
                className={`flex cursor-pointer flex-col items-center gap-1 rounded-[20px] border bg-white px-1 py-3 shadow-sm ${
                  answers.allergens.includes(a.id)
                    ? "border-brand-500 bg-orange-50"
                    : "border-transparent"
                }`}
              >
                <span className="text-xl">{a.emoji}</span>
                <span className="text-center text-[11px] font-semibold leading-4">
                  {a.label}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <input
              value={stopInput}
              onChange={(e) => setStopInput(e.target.value)}
              placeholder="Напиши продукт в стоп-лист"
              className="flex-1 rounded-2xl border-0 bg-white px-4 py-3 text-sm shadow-sm"
            />
            <button
              type="button"
              className="cursor-pointer rounded-2xl bg-white px-4 text-sm font-semibold shadow-sm"
              onClick={() => {
                if (!stopInput.trim()) return;
                patch({ stopList: [...answers.stopList, stopInput.trim()] });
                setStopInput("");
              }}
            >
              Добавить
            </button>
          </div>
        </>
      )}

      {current.id === "store" && (
        <div className="grid grid-cols-3 gap-2.5">
          {STORES.map((store) => (
            <LogoTile
              key={store.id}
              name={store.id}
              letters={store.letters}
              color={store.color}
              logo={store.logo}
              active={answers.store === store.id}
              onClick={() => patch({ store: store.id })}
            />
          ))}
        </div>
      )}

      {current.id === "budget" && (
        <BudgetStep
          budget={answers.budget}
          editing={editingBudget}
          onEdit={() => setEditingBudget(true)}
          onChange={(value) => patch({ budget: value })}
          onCommit={() => setEditingBudget(false)}
        />
      )}

      {current.id === "screening" && (
        <div className="space-y-3">
          {SCREENING_FLAGS.map((f) => (
            <Choice
              key={f.id}
              active={answers.screening.includes(f.id)}
              onClick={() => patch({ screening: toggle(answers.screening, f.id) })}
            >
              {f.label}
            </Choice>
          ))}
          <p className="pt-2 text-xs text-stone-400">Можно ничего не отмечать.</p>
        </div>
      )}

      <NextBar
        label={isLast ? "Посчитать план" : "Далее"}
        disabled={!canNext}
        onNext={() => {
          clearTimeout(advanceTimer.current);
          trackGoal(`quiz_step_${current.id}`);
          if (isLast) void finishQuiz();
          else setStep((s) => s + 1);
        }}
      />
    </Shell>
  );
}

function LandingStep({
  n,
  icon,
  title,
  children,
}: {
  n: number;
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`flex gap-3 ${n > 1 ? "mt-5" : ""}`}>
      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-400 to-brand-600 text-2xl">
        <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-brand-500 bg-white text-[11px] font-extrabold text-brand-600">
          {n}
        </span>
        {icon}
      </div>
      <div>
        <p className="font-extrabold leading-5">{title}</p>
        {children}
      </div>
    </div>
  );
}

function budgetTone(budget: number) {
  if (budget < 4500) {
    return {
      title: "Минимальный",
      sub: "Простые белковые блюда и сезонные овощи",
      boxTitle: "Маловато",
      box: "Ориентир для сушки — от 4 500 ₽ в неделю. Можно уложиться, но разнообразия будет мало.",
      good: false,
    };
  }
  if (budget < 9000) {
    return {
      title: "Сбалансированно",
      sub: "Мясо, рыба и овощи каждый день",
      boxTitle: "Хороший бюджет",
      box: "Ориентир — 4 500–8 000 ₽ в неделю. Этого хватит на белок, рыбу и овощи.",
      good: true,
    };
  }
  if (budget < 16000) {
    return {
      title: "Комфортный",
      sub: "Можно лосось, готовые салаты и больше разнообразия",
      boxTitle: "С запасом",
      box: "Бюджет выше ориентира. Добавим более удобные продукты и рыбу.",
      good: true,
    };
  }
  return {
    title: "Без ограничений",
    sub: "Премиум-продукты и минимум компромиссов",
    boxTitle: "С запасом",
    box: "Можно собрать меню без оглядки на цену.",
    good: true,
  };
}

function BudgetStep({
  budget,
  editing,
  onEdit,
  onChange,
  onCommit,
}: {
  budget: number;
  editing: boolean;
  onEdit: () => void;
  onChange: (value: number) => void;
  onCommit: () => void;
}) {
  const tone = budgetTone(budget);

  return (
    <div className="text-center">
      {editing ? (
        <input
          autoFocus
          type="number"
          min={3500}
          max={50000}
          value={budget}
          onChange={(e) => onChange(Number(e.target.value) || 3500)}
          onBlur={onCommit}
          className="mx-auto w-48 border-0 bg-transparent text-center text-[44px] font-extrabold text-brand-600 outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="mx-auto flex cursor-pointer items-start justify-center gap-1.5"
        >
          <span className="border-b-2 border-dotted border-brand-400 text-[44px] font-extrabold leading-none text-brand-600">
            {budget.toLocaleString("ru-RU")} ₽
          </span>
          <PencilIcon />
        </button>
      )}
      <p className="mt-2 text-sm text-stone-400">
        ≈ {budget.toLocaleString("ru-RU")} ₽ на неделю
      </p>
      <p className="mt-6 text-[20px] font-extrabold">{tone.title}</p>
      <p className="mt-1 text-sm text-stone-500">{tone.sub}</p>
      <div className="mt-8">
        <FancySlider
          min={3500}
          max={30000}
          step={100}
          value={budget}
          onChange={onChange}
          minLabel="3 500 ₽"
          maxLabel="30 000 ₽+"
        />
      </div>
      <HintBox good={tone.good} title={tone.boxTitle} text={tone.box} />
    </div>
  );
}

function stepsTone(steps: number) {
  if (steps < 5000) {
    return {
      title: "Мало движения",
      sub: "Добавим шаги в калории поддержки по факту",
      boxTitle: "Можно больше",
      box: "Ориентир для сушки — 7 000–10 000 шагов. Сейчас база ниже, калории поддержки будут скромнее.",
      good: false,
    };
  }
  if (steps < 12000) {
    return {
      title: "Нормально",
      sub: "Этого хватает, чтобы держать расход",
      boxTitle: "Хороший уровень",
      box: "Ориентир — 7 000–10 000 шагов в день. Учтём это в калориях поддержки.",
      good: true,
    };
  }
  return {
    title: "Много ходьбы",
    sub: "Расход выше среднего — это плюс к сушке",
    boxTitle: "С запасом",
    box: "Высокая ходьба ускоряет дефицит. Главное — не ломать восстановление.",
    good: true,
  };
}

function StepsStep({
  steps,
  editing,
  onEdit,
  onChange,
  onCommit,
}: {
  steps: number;
  editing: boolean;
  onEdit: () => void;
  onChange: (value: number) => void;
  onCommit: () => void;
}) {
  const tone = stepsTone(steps);
  return (
    <div className="text-center">
      {editing ? (
        <input
          autoFocus
          type="number"
          min={2000}
          max={30000}
          value={steps}
          onChange={(e) => onChange(Number(e.target.value) || 2000)}
          onBlur={onCommit}
          className="mx-auto w-48 border-0 bg-transparent text-center text-[44px] font-extrabold text-brand-600 outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={onEdit}
          className="mx-auto flex cursor-pointer items-start justify-center gap-1.5"
        >
          <span className="border-b-2 border-dotted border-brand-400 text-[44px] font-extrabold leading-none text-brand-600">
            {steps.toLocaleString("ru-RU")}
          </span>
          <PencilIcon />
        </button>
      )}
      <p className="mt-2 text-sm text-stone-400">шагов в день</p>
      <p className="mt-6 text-[20px] font-extrabold">{tone.title}</p>
      <p className="mt-1 text-sm text-stone-500">{tone.sub}</p>
      <div className="mt-8">
        <FancySlider
          min={2000}
          max={20000}
          step={500}
          value={steps}
          onChange={onChange}
          minLabel="2 000"
          maxLabel="20 000+"
        />
      </div>
      <HintBox good={tone.good} title={tone.boxTitle} text={tone.box} />
    </div>
  );
}

function MetricField({
  label,
  unit,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-stone-400">{label}</p>
      <div className="mt-2 flex items-baseline justify-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            const next = Number(e.target.value);
            if (!Number.isFinite(next)) return;
            onChange(next);
          }}
          className="w-32 border-b-2 border-dotted border-brand-400 bg-transparent text-center text-[44px] font-extrabold leading-none text-brand-600 outline-none"
        />
        <span className="text-xl font-extrabold text-brand-600">{unit}</span>
      </div>
      <div className="mt-5">
        <FancySlider
          min={min}
          max={max}
          value={Math.min(max, Math.max(min, value))}
          onChange={onChange}
          minLabel={String(min)}
          maxLabel={String(max)}
        />
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="mt-2 text-brand-500"
      aria-hidden
    >
      <path
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HintBox({
  good,
  title,
  text,
}: {
  good: boolean;
  title: string;
  text: string;
}) {
  return (
    <div
      className={`mt-8 rounded-[22px] border px-4 py-4 text-left ${
        good ? "border-emerald-200 bg-emerald-50" : "border-orange-200 bg-orange-50"
      }`}
    >
      <p
        className={`flex items-center gap-2 text-[15px] font-extrabold ${
          good ? "text-emerald-700" : "text-brand-700"
        }`}
      >
        <span
          className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white ${
            good ? "bg-emerald-500" : "bg-brand-500"
          }`}
        >
          ✓
        </span>
        {title}
      </p>
      <p className="mt-1 text-[13px] leading-5 text-stone-600">{text}</p>
    </div>
  );
}

function PayCheck({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-left text-xs leading-5 text-white/90">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
          checked
            ? "border-white bg-white text-brand-600"
            : "border-white/70 bg-white/10"
        }`}
      >
        {checked ? (
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
            <path
              d="M2 6.2 4.6 9 10 3"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </span>
      <span>{children}</span>
    </label>
  );
}

function StatusDot({ done, current }: { done: boolean; current: boolean }) {
  if (done) {
    return (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-[11px] text-white">
        ✓
      </span>
    );
  }
  if (current) {
    return (
      <span className="h-5 w-5 rounded-full border-[3px] border-dashed border-brand-500" />
    );
  }
  return <span className="h-5 w-5 rounded-full bg-stone-200" />;
}
