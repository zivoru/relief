import {
  CATEGORY_THRESHOLDS,
  ESSENTIAL_FAT_G,
  FAT_KCAL_PER_KG,
  FORECAST_CONSERVATIVE,
  GYM_MINUTES,
  HOME_MINUTES,
  NOVICE_KCAL_PER_KG_MIN,
  PHASE,
  PROTEIN_PER_KG_LBM,
  SOFT_DEFICIT,
  SOFT_PROTEIN_PER_KG,
  STEP_KCAL_PER_KG,
  TEF_RATIO,
  TRAINED_KCAL_PER_KG_MIN,
  VEG_CARB_G,
  type Category,
} from "./config";
import type { CalcResult, QuizAnswers } from "@/lib/quiz/types";

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function leanBodyMassKg(weightKg: number, bodyFatPct: number): number {
  return weightKg * (1 - bodyFatPct / 100);
}

export function categoryFromFat(
  sex: QuizAnswers["sex"],
  bodyFatPct: number,
): Category {
  const t = CATEGORY_THRESHOLDS[sex];
  if (bodyFatPct <= t.lean) return "lean";
  if (bodyFatPct <= t.overweight) return "overweight";
  return "obese";
}

export function categoryLabel(category: Category, sex: QuizAnswers["sex"]): string {
  if (category === "lean") {
    return sex === "male" ? "Стройный (до 15% жира)" : "Стройная (до 24% жира)";
  }
  if (category === "overweight") {
    return sex === "male"
      ? "Лишний вес (16–25% жира)"
      : "Лишний вес (25–34% жира)";
  }
  return sex === "male"
    ? "Ожирение (от 26% жира)"
    : "Ожирение (от 35% жира)";
}

export function mifflinStJeor(input: {
  sex: QuizAnswers["sex"];
  weightKg: number;
  heightCm: number;
  age: number;
}): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  return input.sex === "male" ? base + 5 : base - 161;
}

export function trainingMinutes(activity: QuizAnswers["activity"]): number {
  if (activity === "gym") return GYM_MINUTES;
  if (activity === "home") return HOME_MINUTES;
  return 0;
}

export function calculate(answers: QuizAnswers): CalcResult {
  const lbmKg = round1(leanBodyMassKg(answers.weightKg, answers.bodyFatPct));
  const category = categoryFromFat(answers.sex, answers.bodyFatPct);
  const trained = answers.experience === "trained" && answers.activity !== "none";
  const minutes = trainingMinutes(answers.activity);
  const trainCoeff = trained
    ? TRAINED_KCAL_PER_KG_MIN
    : NOVICE_KCAL_PER_KG_MIN;

  const bmr = Math.round(mifflinStJeor(answers));
  const tef = Math.round(bmr * TEF_RATIO);
  const stepsKcal = Math.round(
    answers.weightKg * answers.steps * STEP_KCAL_PER_KG,
  );
  const trainingKcal = Math.round(trainCoeff * answers.weightKg * minutes);
  const maintenanceCalories = bmr + tef + stepsKcal + trainingKcal;

  const screeningHit = answers.screening.length > 0;
  const phase = PHASE[category];

  if (screeningHit) {
    const dietCalories = Math.round(maintenanceCalories * (1 - SOFT_DEFICIT));
    const proteinG = Math.round(SOFT_PROTEIN_PER_KG * answers.weightKg);
    const fatG = Math.max(
      40,
      Math.round(((dietCalories - proteinG * 4) * 0.35) / 9),
    );
    const carbG = Math.max(
      80,
      Math.round((dietCalories - proteinG * 4 - fatG * 9) / 4),
    );
    const deficit = maintenanceCalories - dietCalories;
    const forecastWeeks = 4;
    const rawKg =
      ((deficit * forecastWeeks * 7) / FAT_KCAL_PER_KG) * FORECAST_CONSERVATIVE;
    const forecastKg = Math.max(1.5, round1(rawKg));

    return {
      mode: "soft",
      sex: answers.sex,
      weightKg: answers.weightKg,
      heightCm: answers.heightCm,
      age: answers.age,
      bodyFatPct: answers.bodyFatPct,
      lbmKg,
      category,
      categoryLabel: categoryLabel(category, answers.sex),
      proteinG,
      fatG,
      carbG,
      dietCalories,
      bmr,
      tef,
      stepsKcal,
      trainingKcal,
      trainingMinutes: minutes,
      maintenanceCalories,
      deficit,
      phaseDays: 14,
      phaseLabel: "мягкий дефицит 20% на 3–4 месяца",
      refeed: "soft",
      forecastKg,
      forecastWeeks,
      forecastLabel: `около ${forecastKg.toLocaleString("ru-RU")} кг жира за ${forecastWeeks} недели при дефиците 20%`,
    };
  }

  const proteinRate =
    PROTEIN_PER_KG_LBM[category][trained ? "trained" : "sedentary"];
  const proteinG = Math.round(proteinRate * lbmKg);
  const fatG = ESSENTIAL_FAT_G;
  const carbG = VEG_CARB_G;
  const dietCalories = Math.round(proteinG * 4 + fatG * 9 + carbG * 4);
  const deficit = Math.max(200, maintenanceCalories - dietCalories);
  const forecastWeeks = Math.min(4, Math.max(2, Math.round(phase.days / 7)));
  const rawKg =
    ((deficit * forecastWeeks * 7) / FAT_KCAL_PER_KG) * FORECAST_CONSERVATIVE;
  const cap = answers.weightKg * 0.08;
  const forecastKg = Math.max(2, round1(Math.min(rawKg, cap)));

  return {
    mode: "psmf",
    sex: answers.sex,
    weightKg: answers.weightKg,
    heightCm: answers.heightCm,
    age: answers.age,
    bodyFatPct: answers.bodyFatPct,
    lbmKg,
    category,
    categoryLabel: categoryLabel(category, answers.sex),
    proteinG,
    fatG,
    carbG,
    dietCalories,
    bmr,
    tef,
    stepsKcal,
    trainingKcal,
    trainingMinutes: minutes,
    maintenanceCalories,
    deficit,
    phaseDays: phase.days,
    phaseLabel: phase.label,
    refeed: phase.refeed,
    forecastKg,
    forecastWeeks,
    forecastLabel: `около ${forecastKg.toLocaleString("ru-RU")} кг жира за ${forecastWeeks} недели, сохранив мышцы`,
  };
}
