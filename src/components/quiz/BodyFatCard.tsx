import type { Sex } from "@/lib/psmf/config";

export function BodyFatCard({
  sex,
  pct,
  selected,
  onSelect,
}: {
  sex: Sex;
  pct: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const width = 18 + pct * 0.55;
  const waist = 14 + pct * 0.7;
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex cursor-pointer flex-col items-center gap-2 rounded-[22px] border bg-white px-2 py-3 shadow-sm transition ${
        selected ? "border-brand-500 bg-orange-50" : "border-transparent"
      }`}
    >
      <svg viewBox="0 0 48 88" className="h-24 w-12" aria-hidden>
        <circle cx="24" cy="10" r="7" fill="#1c1917" />
        {sex === "female" ? (
          <>
            <path
              d={`M24 18 C ${24 - width / 2} 24, ${24 - waist / 2} 42, ${24 - waist / 2 + 1} 52
                 L ${20} 86 L ${28} 86 L ${24 + waist / 2 - 1} 52
                 C ${24 + waist / 2} 42, ${24 + width / 2} 24, 24 18 Z`}
              fill="#1c1917"
            />
            <ellipse cx="24" cy="32" rx={width / 2.2} ry="6" fill="#1c1917" />
          </>
        ) : (
          <path
            d={`M16 20 L32 20 L ${24 + width / 2} 36 L ${24 + waist / 2} 52 L30 86 L18 86 L ${24 - waist / 2} 52 L ${24 - width / 2} 36 Z`}
            fill="#1c1917"
          />
        )}
      </svg>
      <span
        className={`text-sm font-extrabold ${selected ? "text-brand-600" : "text-stone-800"}`}
      >
        {pct}%
      </span>
    </button>
  );
}
