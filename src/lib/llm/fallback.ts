import type { GeneratedPlan } from "./schema";
import type { CalcResult, QuizAnswers } from "@/lib/quiz/types";
import { FOOD_CARDS } from "@/lib/psmf/config";

const PROTEIN_MEALS: Record<string, { name: string; ingredients: string[] }> = {
  chicken: {
    name: "Куриная грудка в аэрогриле",
    ingredients: ["куриная грудка 200 г", "специи без сахара", "паприка"],
  },
  turkey: {
    name: "Филе индейки",
    ingredients: ["индейка 200 г", "лимон", "специи"],
  },
  beef: {
    name: "Говядина на гриле",
    ingredients: ["говядина 180 г", "чеснок", "чёрный перец"],
  },
  eggwhite: {
    name: "Омлет из яичного белка",
    ingredients: ["белки 6 шт", "помидор", "болгарский перец"],
  },
  cottage: {
    name: "Творог 0% с зеленью",
    ingredients: ["творог 0% 250 г", "огурцы", "укроп"],
  },
  salmon: {
    name: "Лосось на пару",
    ingredients: ["лосось 150 г", "лимон", "укроп"],
  },
  tuna: {
    name: "Тунец с салатом",
    ingredients: ["тунец в собственном соку 150 г", "лук", "огурцы"],
  },
  shrimp: {
    name: "Креветки с овощами",
    ingredients: ["креветки 200 г", "чеснок", "цукини"],
  },
  whey: {
    name: "Протеин вокруг тренировки",
    ingredients: ["сывороточный протеин 30 г", "вода"],
  },
};

const VEG = [
  "огурцы",
  "помидоры",
  "капуста",
  "брокколи",
  "цукини",
  "грибы",
  "сельдерей",
  "стручковая фасоль",
];

function pickLiked(answers: QuizAnswers): string[] {
  const liked = answers.likedFoods.filter((id) => PROTEIN_MEALS[id]);
  const fallback = ["chicken", "eggwhite", "cottage", "tuna"];
  const merged = [...liked, ...fallback.filter((id) => !liked.includes(id))];
  return merged.filter((id) => {
    if (answers.allergens.includes("eggs") && id === "eggwhite") return false;
    if (answers.allergens.includes("fish") && (id === "salmon" || id === "tuna"))
      return false;
    if (answers.allergens.includes("seafood") && id === "shrimp") return false;
    if (answers.allergens.includes("lactose") && id === "cottage") return false;
    if (answers.allergens.includes("redmeat") && id === "beef") return false;
    return true;
  });
}

function salad(): { name: string; ingredients: string[] } {
  return {
    name: "Овощной салат",
    ingredients: [VEG[0], VEG[1], VEG[2], "уксус / лимон", "соевый соус"],
  };
}

export function fallbackPlan(
  calc: CalcResult,
  answers: QuizAnswers,
): GeneratedPlan {
  const proteins = pickLiked(answers);
  const days = 14;
  const refeedDays: GeneratedPlan["refeedDays"] = [];
  const proteinPerMeal = Math.round(calc.proteinG / 3);

  const menu: GeneratedPlan["menu"] = [];
  for (let day = 1; day <= days; day++) {
    const isRefeed =
      calc.refeed === "weekly" && day % 7 === 0
        ? true
        : calc.refeed === "after" && day === 11;
    if (isRefeed) {
      const carbsG = calc.category === "lean" ? 250 : 180;
      refeedDays.push({
        day,
        carbsG,
        instruction:
          "5-часовой рефид: углеводы вокруг силовой, минимум жиров. Гречка, рис, багет, бананы, джем. Без фастфуда.",
      });
    }
    const a = PROTEIN_MEALS[proteins[day % proteins.length]] ?? PROTEIN_MEALS.chicken;
    const b = PROTEIN_MEALS[proteins[(day + 1) % proteins.length]] ?? PROTEIN_MEALS.turkey;
    const c = PROTEIN_MEALS[proteins[(day + 2) % proteins.length]] ?? PROTEIN_MEALS.cottage;
    const veg = salad();

    if (isRefeed) {
      menu.push({
        day,
        isRefeed: true,
        meals: [
          {
            name: "Гречка на обезжиренном молоке",
            ingredients: ["гречка 80 г сухой", "молоко 0% 200 мл"],
            proteinG: 20,
            notes: "До тренировки",
          },
          {
            name: `${a.name} + углеводы`,
            ingredients: [...a.ingredients, "рис 150 г сухого", "кетчуп без сахара"],
            proteinG: proteinPerMeal,
            notes: "После тренировки, основная порция углеводов",
          },
          {
            name: "Багет со сгущёнкой и белки",
            ingredients: ["багет 120 г", "сгущёнка 20 г", "яичные белки 3 шт"],
            proteinG: 25,
          },
        ],
      });
    } else {
      menu.push({
        day,
        isRefeed: false,
        meals: [
          {
            name: a.name,
            ingredients: [...a.ingredients, ...veg.ingredients.slice(0, 2)],
            proteinG: proteinPerMeal,
          },
          {
            name: b.name,
            ingredients: [...b.ingredients, veg.ingredients[2] ?? "капуста"],
            proteinG: proteinPerMeal,
          },
          {
            name: c.name,
            ingredients: c.ingredients,
            proteinG: Math.max(20, calc.proteinG - proteinPerMeal * 2),
          },
        ],
      });
    }
  }

  const likedNames = answers.likedFoods
    .map((id) => FOOD_CARDS.find((f) => f.id === id)?.name)
    .filter(Boolean) as string[];

  const workouts =
    answers.activity === "none"
      ? [
          {
            name: "Ходьба",
            when: "ежедневно",
            exercises: [
              {
                name: "Прогулка в комфортном темпе",
                sets: "1",
                reps: `${Math.max(6000, answers.steps)} шагов`,
              },
            ],
          },
        ]
      : [
          {
            name: "Верх тела",
            when: "2 раза в неделю, 6–10 повторений, рабочие веса не снижать",
            exercises: [
              { name: "Жим лёжа на наклонной", sets: "2–3", reps: "6–10" },
              { name: "Шраги", sets: "2–3", reps: "8–10" },
              { name: "Тяга параллельным хватом", sets: "2–3", reps: "6–10" },
              { name: "Махи на плечи", sets: "2", reps: "8–10" },
              { name: "Молот на бицепс", sets: "2", reps: "8–10" },
              { name: "Разгибания на трицепс с канатом", sets: "2", reps: "8–10" },
              { name: "Тяга каната к лицу", sets: "2", reps: "10" },
            ],
          },
          {
            name: "Низ тела",
            when: "2 раза в неделю, без суперсетов и дроп-сетов",
            exercises: [
              { name: "Разгибание ног сидя", sets: "2–3", reps: "8–10" },
              { name: "Подъёмы на носки стоя", sets: "2–3", reps: "8–12" },
              { name: "Румынская тяга", sets: "2–3", reps: "6–10" },
              { name: "Гиперэкстензия", sets: "2", reps: "8–10" },
              { name: "Пресс", sets: "2", reps: "8–12" },
            ],
          },
        ];

  const startCalories = calc.dietCalories;
  const target = calc.maintenanceCalories;
  const bump = Math.round((target - startCalories) / 8);

  return {
    summary:
      calc.mode === "soft"
        ? `Мягкий план: дефицит 20% (${calc.dietCalories} ккал), белок ${calc.proteinG} г. Жёсткая PSMF-фаза вам сейчас не подходит.`
        : `PSMF-фаза: ${calc.dietCalories} ккал, белок ${calc.proteinG} г, жиры ${calc.fatG} г, углеводы ${calc.carbG} г из овощей. Категория: ${calc.categoryLabel}.`,
    menu,
    shoppingList: [
      { item: "Куриная грудка", amount: "1.4 кг", aisle: "мясо" },
      { item: "Яичный белок / яйца", amount: "30 шт", aisle: "яйца" },
      { item: "Творог 0%", amount: "1.5 кг", aisle: "молочка" },
      { item: "Овощи для салата", amount: "4 кг", aisle: "овощи" },
      { item: "Рыбий жир / лосось", amount: "400 г или капсулы", aisle: "рыба" },
      { item: "Протеин", amount: "1 банка", aisle: "спортпит" },
      { item: "Мультивитамины", amount: "1 упаковка", aisle: "аптека" },
      ...(likedNames.slice(0, 4).map((item) => ({
        item,
        amount: "по вкусу",
        aisle: answers.store,
      })) as GeneratedPlan["shoppingList"]),
    ],
    refeedDays,
    workouts,
    exitPlan: {
      days: 8,
      startCalories,
      targetCalories: target,
      steps: [
        `Дни 1–8 после фазы: поднимайте калории примерно на ${bump} ккал в день до ${target} ккал.`,
        "Белок в каждом приёме пищи сохраняйте.",
        `Ориентир шагов: ${answers.steps.toLocaleString("ru-RU")} в день.`,
        "Силовые не бросайте. Лёгкое кардио 20–30 минут 1–2 раза в неделю — по самочувствию.",
        "На весах может прибавиться 1–3 кг воды и гликогена — это не жир.",
        "Сон 7,5–9 часов.",
      ],
    },
    tips: [
      "Кофе с сахарозаменителем и обезжиренным молоком — ок.",
      "Крахмалистые: картофель, крупы, бобовые — только в рефид.",
      "Омега-3: жирная рыба или капсулы рыбьего жира. Льняное масло почти не конвертируется.",
      "Калий ~1 г, магний ~500 мг, кальций 600–1200 мг — через еду или аптеку.",
      "Не возвращайтесь к старому режиму сразу после фазы.",
    ],
    supplements: [
      "Мультивитамины (Компливит или аналог)",
      "Омега-3 (рыбий жир)",
      "Креатин 5 г в день — помогает сохранить мышцы",
    ],
  };
}
