export const PRICE_RUB = Number(process.env.PLAN_PRICE ?? 390);

export const FAT_KCAL_PER_KG = 7700;

export const ESSENTIAL_FAT_G = 25;
export const VEG_CARB_G = 30;

export const TEF_RATIO = 0.1;
export const STEP_KCAL_PER_KG = 0.00045;
export const TRAINED_KCAL_PER_KG_MIN = 0.1;
export const NOVICE_KCAL_PER_KG_MIN = 0.05;

export const GYM_MINUTES = 60;
export const HOME_MINUTES = 40;

export const FORECAST_CONSERVATIVE = 0.75;

export type Sex = "male" | "female";
export type Category = "lean" | "overweight" | "obese";
export type Activity = "none" | "home" | "gym";
export type Experience = "novice" | "trained";

export const CATEGORY_THRESHOLDS: Record<
  Sex,
  { lean: number; overweight: number }
> = {
  male: { lean: 15, overweight: 25 },
  female: { lean: 24, overweight: 34 },
};

/** Grams of protein per kg of lean body mass. */
export const PROTEIN_PER_KG_LBM: Record<
  Category,
  Record<"sedentary" | "trained", number>
> = {
  lean: { sedentary: 2.2, trained: 2.5 },
  overweight: { sedentary: 1.9, trained: 2.2 },
  obese: { sedentary: 1.6, trained: 1.9 },
};

export const PHASE: Record<
  Category,
  { days: number; refeed: "after" | "weekly" | "none"; label: string }
> = {
  lean: {
    days: 11,
    refeed: "after",
    label: "до 11 дней, затем рефид",
  },
  overweight: {
    days: 28,
    refeed: "weekly",
    label: "2–6 недель, рефид 5 часов раз в неделю",
  },
  obese: {
    days: 70,
    refeed: "none",
    label: "6–12 недель без рефидов",
  },
};

export const SOFT_DEFICIT = 0.2;
export const SOFT_PROTEIN_PER_KG = 1.8;

export const BODY_FAT_OPTIONS: Record<Sex, number[]> = {
  male: [8, 12, 15, 20, 25, 30, 35, 40],
  female: [16, 20, 24, 28, 32, 36, 40, 45],
};

export const GYMS = [
  { id: "ddx", name: "DDX", letters: "DDX", color: "#E10600", logo: "/logos/gyms/ddx.png" },
  { id: "worldclass", name: "World Class", letters: "WC", color: "#111111", logo: "/logos/gyms/worldclass.png" },
  { id: "xfit", name: "X-Fit", letters: "XF", color: "#FF5A00", logo: "/logos/gyms/xfit.png" },
  { id: "spirit", name: "Spirit", letters: "S", color: "#1A1A1A", logo: "/logos/gyms/spirit.png" },
  { id: "alex", name: "Alex Fitness", letters: "AF", color: "#222222", logo: "/logos/gyms/alex.png" },
  { id: "wegym", name: "WeGym", letters: "WG", color: "#6D28D9", logo: "/logos/gyms/wegym.png" },
  { id: "crocus", name: "Crocus", letters: "CF", color: "#14532D", logo: "/logos/gyms/crocus.png" },
  { id: "zebra", name: "Зебра", letters: "Z", color: "#0F172A", logo: "/logos/gyms/zebra.png" },
  { id: "encore", name: "Encore", letters: "E", color: "#171717", logo: "/logos/gyms/encore.png" },
  { id: "golds", name: "Gold's Gym", letters: "G", color: "#B45309", logo: "/logos/gyms/golds.png" },
  { id: "fitnesshouse", name: "Fitness House", letters: "FH", color: "#1D4ED8", logo: "/logos/gyms/fitnesshouse.png" },
  { id: "athletica", name: "Athletica", letters: "A", color: "#1E3A8A", logo: "/logos/gyms/athletica.png" },
  { id: "home", name: "Дома", letters: "🏠", color: "#FFF4EB" },
  { id: "other", name: "Другой зал", letters: "🏋️", color: "#FFF4EB" },
] as const;

export function activityFromGym(gymId: string): Activity {
  if (gymId === "home") return "home";
  return "gym";
}

export const STORES = [
  { id: "Магнит", color: "#E31E24", letters: "М", logo: "/logos/stores/magnit.png" },
  { id: "Пятёрочка", color: "#2E7D32", letters: "П", logo: "/logos/stores/pyaterochka.png" },
  { id: "Дикси", color: "#E65100", letters: "Д", logo: "/logos/stores/diksi.png" },
  { id: "Чижик", color: "#F5C518", letters: "Ч", logo: "/logos/stores/chizhik.png" },
  { id: "Светофор", color: "#D32F2F", letters: "С", logo: "/logos/stores/svetofor.png" },
  { id: "Перекрёсток", color: "#007A3D", letters: "П+", logo: "/logos/stores/perekrestok.png" },
  { id: "Лента", color: "#0B57D0", letters: "Л", logo: "/logos/stores/lenta.png" },
  { id: "Ашан", color: "#E30613", letters: "A", logo: "/logos/stores/ashan.png" },
  { id: "ВкусВилл", color: "#7CB342", letters: "ВВ", logo: "/logos/stores/vkusvill.png" },
  { id: "Яндекс Лавка", color: "#3B82F6", letters: "Я", logo: "/logos/stores/lavka.png" },
  { id: "Самокат", color: "#FF2E63", letters: "Ск", logo: "/logos/stores/samokat.png" },
] as const;

export const FOOD_CARDS = [
  { id: "chicken", name: "Куриная грудка", kcal: 165, tag: "белок" },
  { id: "turkey", name: "Индейка", kcal: 135, tag: "белок" },
  { id: "beef", name: "Говядина", kcal: 187, tag: "белок" },
  { id: "eggwhite", name: "Яичный белок", kcal: 52, tag: "белок" },
  { id: "cottage", name: "Творог 0%", kcal: 71, tag: "белок" },
  { id: "salmon", name: "Лосось", kcal: 208, tag: "омега-3" },
  { id: "tuna", name: "Тунец", kcal: 132, tag: "белок" },
  { id: "shrimp", name: "Креветки", kcal: 99, tag: "белок" },
  { id: "codliver", name: "Печень трески", kcal: 613, tag: "омега-3" },
  { id: "whey", name: "Сывороточный протеин", kcal: 120, tag: "тренировка" },
  { id: "broccoli", name: "Брокколи", kcal: 34, tag: "овощи" },
  { id: "cabbage", name: "Капуста", kcal: 25, tag: "овощи" },
  { id: "cucumber", name: "Огурцы", kcal: 15, tag: "овощи" },
  { id: "tomato", name: "Помидоры", kcal: 18, tag: "овощи" },
  { id: "zucchini", name: "Цукини", kcal: 17, tag: "овощи" },
  { id: "mushrooms", name: "Грибы", kcal: 22, tag: "овощи" },
  { id: "celery", name: "Сельдерей", kcal: 16, tag: "овощи" },
  { id: "eggplant", name: "Баклажаны", kcal: 25, tag: "овощи" },
  { id: "greenbeans", name: "Стручковая фасоль", kcal: 31, tag: "овощи" },
  { id: "berries", name: "Малина", kcal: 52, tag: "ягоды" },
] as const;

export const ALLERGENS = [
  { id: "nuts", label: "Орехи", emoji: "🌰" },
  { id: "gluten", label: "Глютен", emoji: "🌾" },
  { id: "lactose", label: "Лактоза", emoji: "🥛" },
  { id: "peanut", label: "Арахис", emoji: "🥜" },
  { id: "seafood", label: "Морепродукты", emoji: "🦐" },
  { id: "eggs", label: "Яйца", emoji: "🥚" },
  { id: "soy", label: "Соя", emoji: "🫘" },
  { id: "fish", label: "Рыба", emoji: "🐟" },
  { id: "citrus", label: "Цитрусовые", emoji: "🍊" },
  { id: "mushrooms", label: "Грибы", emoji: "🍄" },
  { id: "onion", label: "Лук", emoji: "🧅" },
  { id: "garlic", label: "Чеснок", emoji: "🧄" },
  { id: "pork", label: "Свинина", emoji: "🥓" },
  { id: "redmeat", label: "Красное мясо", emoji: "🥩" },
  { id: "spicy", label: "Острое", emoji: "🌶" },
] as const;

export const GOALS = [
  { id: "vacation", label: "Отпуск / пляж", emoji: "🏖️" },
  { id: "wedding", label: "Свадьба / событие", emoji: "💍" },
  { id: "summer", label: "К лету", emoji: "☀️" },
  { id: "health", label: "Здоровье", emoji: "❤️" },
  { id: "just", label: "Просто хочу", emoji: "✨" },
] as const;

export const SCREENING_FLAGS = [
  { id: "under18", label: "Мне нет 18 лет" },
  { id: "pregnant", label: "Беременность или грудное вскармливание" },
  { id: "diabetes", label: "Диабет, принимаю препараты" },
  { id: "kidney", label: "Болезни почек или печени" },
  { id: "ed", label: "Расстройство пищевого поведения сейчас или в прошлом" },
] as const;

export const FORBIDDEN_SUPPLEMENTS = [
  "эфедрин",
  "ephedrine",
  "кленбутерол",
  "clenbuterol",
  "йохимбин",
  "yohimbine",
  "clen",
  "dnp",
  "сибутрамин",
];
