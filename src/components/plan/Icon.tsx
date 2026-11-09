"use client";

import { useEffect, useState, type ReactNode } from "react";

export function Ms({
  name,
  fill = true,
  size = 22,
  weight = 500,
  rounded = false,
  className = "",
}: {
  name: string;
  fill?: boolean;
  size?: number;
  weight?: number;
  rounded?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`${rounded ? "material-symbols-rounded" : "material-symbols-outlined"} ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}

export function IconBubble({
  name,
  emoji,
  src,
  tint = "#FF8A4C",
  size = "md",
}: {
  name: string;
  emoji?: string;
  src?: string;
  tint?: string;
  size?: "sm" | "md" | "lg";
}) {
  const box =
    size === "lg"
      ? "h-[72px] w-[72px] text-[32px]"
      : size === "sm"
        ? "h-9 w-9 text-lg"
        : "h-11 w-11 text-[22px]";
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ${box}`}
      style={{ background: `${tint}22`, color: tint }}
    >
      {src ? (
        <Art src={src} fallback={emoji ? <span>{emoji}</span> : <Ms name={name} />} />
      ) : emoji ? (
        <span>{emoji}</span>
      ) : (
        <Ms name={name} />
      )}
    </span>
  );
}

function Art({ src, fallback }: { src: string; fallback: ReactNode }) {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.onload = () => setOk(true);
    img.onerror = () => setOk(false);
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);
  if (!ok) return <>{fallback}</>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className="h-full w-full object-cover" />
  );
}

export type Visual = {
  icon: string;
  emoji: string;
  tint: string;
  image?: string;
};

export function mealVisual(name: string, ingredients: string[] = []): Visual {
  const t = `${name} ${ingredients.join(" ")}`.toLowerCase();
  if (/куриц/.test(t))
    return { icon: "skillet", emoji: "🍗", tint: "#E85D04", image: "/plan/food/chicken.png" };
  if (/индейк/.test(t))
    return { icon: "skillet", emoji: "🦃", tint: "#C2410C", image: "/plan/food/turkey.png" };
  if (/говяд/.test(t))
    return { icon: "kebab_dining", emoji: "🥩", tint: "#9F1239", image: "/plan/food/beef.png" };
  if (/яич|омлет|белк/.test(t))
    return { icon: "egg_alt", emoji: "🥚", tint: "#CA8A04", image: "/plan/food/eggs.png" };
  if (/творог/.test(t))
    return { icon: "grocery", emoji: "🧀", tint: "#A16207", image: "/plan/food/cottage.png" };
  if (/лосос/.test(t))
    return { icon: "set_meal", emoji: "🍣", tint: "#E11D48", image: "/plan/food/salmon.png" };
  if (/тунец|рыб/.test(t))
    return { icon: "set_meal", emoji: "🐟", tint: "#0369A1", image: "/plan/food/tuna.png" };
  if (/кревет/.test(t))
    return { icon: "ramen_dining", emoji: "🍤", tint: "#EA580C", image: "/plan/food/shrimp.png" };
  if (/протеин/.test(t))
    return { icon: "science", emoji: "🥤", tint: "#7C3AED", image: "/plan/food/whey.png" };
  if (/гречк|рис|багет|углевод/.test(t))
    return { icon: "rice_bowl", emoji: "🍚", tint: "#B45309", image: "/plan/food/carbs.png" };
  if (/салат|овощ|огурец|помидор|капуст|брокколи/.test(t))
    return { icon: "nutrition", emoji: "🥗", tint: "#16A34A", image: "/plan/food/salad.png" };
  return { icon: "restaurant", emoji: "🍽️", tint: "#F97316", image: "/plan/food/meal.png" };
}

function exImage(sex: "male" | "female", slug: string) {
  return `/plan/ex/${sex}/${slug}.png`;
}

export function exerciseVisual(name: string, sex: "male" | "female"): Visual {
  const t = name.toLowerCase();
  const img = (slug: string) => exImage(sex, slug);
  if (/жим/.test(t))
    return { icon: "fitness_center", emoji: "🏋️", tint: "#EA580C", image: img("press") };
  if (/шраги/.test(t))
    return { icon: "accessibility_new", emoji: "🤷", tint: "#C2410C", image: img("shrug") };
  if (/тяга каната|лицу/.test(t))
    return { icon: "sports", emoji: "🪢", tint: "#B45309", image: img("face-pull") };
  if (/тяга/.test(t))
    return { icon: "fitness_center", emoji: "💪", tint: "#9A3412", image: img("row") };
  if (/махи|плеч/.test(t))
    return { icon: "sports_gymnastics", emoji: "🙆", tint: "#D97706", image: img("raise") };
  if (/бицепс|молот/.test(t))
    return { icon: "exercise", emoji: "💪", tint: "#E11D48", image: img("curl") };
  if (/трицепс|разгибания на/.test(t))
    return { icon: "exercise", emoji: "🦾", tint: "#BE123C", image: img("pushdown") };
  if (/разгибание ног/.test(t))
    return { icon: "directions_run", emoji: "🦵", tint: "#CA8A04", image: img("leg-ext") };
  if (/носки/.test(t))
    return { icon: "footprint", emoji: "🦶", tint: "#A16207", image: img("calf") };
  if (/румын/.test(t))
    return { icon: "fitness_center", emoji: "🏋️", tint: "#9A3412", image: img("rdl") };
  if (/гипер/.test(t))
    return { icon: "accessibility_new", emoji: "🧘", tint: "#65A30D", image: img("hyper") };
  if (/пресс/.test(t))
    return { icon: "self_improvement", emoji: "🔥", tint: "#EA580C", image: img("abs") };
  if (/ходьб|прогул|шаг/.test(t))
    return { icon: "directions_walk", emoji: "🚶", tint: "#0284C7", image: img("walk") };
  return { icon: "fitness_center", emoji: "🏋️", tint: "#F97316", image: img("gym") };
}

export function aisleVisual(aisle = ""): Visual {
  const t = aisle.toLowerCase();
  if (/мясо/.test(t)) return { icon: "kebab_dining", emoji: "🥩", tint: "#E11D48" };
  if (/яйц/.test(t)) return { icon: "egg_alt", emoji: "🥚", tint: "#CA8A04" };
  if (/молок/.test(t)) return { icon: "grocery", emoji: "🥛", tint: "#0369A1" };
  if (/овощ/.test(t)) return { icon: "nutrition", emoji: "🥦", tint: "#16A34A" };
  if (/рыб/.test(t)) return { icon: "set_meal", emoji: "🐟", tint: "#0284C7" };
  if (/спорт/.test(t)) return { icon: "science", emoji: "🥤", tint: "#7C3AED" };
  if (/аптек/.test(t)) return { icon: "pill", emoji: "💊", tint: "#0F766E" };
  return { icon: "shopping_basket", emoji: "🛒", tint: "#F97316" };
}
