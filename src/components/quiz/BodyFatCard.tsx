import type { Sex } from "@/lib/psmf/config";

function figureSrc(sex: Sex, pct: number) {
  return `/figures/${sex}-${String(pct).padStart(2, "0")}.png`;
}

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
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-[22px] border bg-[#FEF6ED] px-1 py-2 shadow-sm transition ${
        selected ? "border-brand-500" : "border-transparent"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={figureSrc(sex, pct)}
        alt=""
        className="h-36 w-full object-contain"
      />
      <span
        className={`text-sm font-extrabold ${selected ? "text-brand-600" : "text-stone-800"}`}
      >
        {pct}%
      </span>
    </button>
  );
}
