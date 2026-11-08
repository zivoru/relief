import { BRAND } from "@/lib/brand";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pb-36 pt-3">
      {children}
    </div>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 -990 960 960"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        fill="currentColor"
        d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"
      />
    </svg>
  );
}

export function ArrowIcon2({ className = "" }: { className?: string }) {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 -960 860 960"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        fill="currentColor"
        d="M504-480 348-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L404-268q-11 11-28 11t-28-11q-11-11-11-28t11-28l156-156Z"
      />
    </svg>
  );
}

export function QuizHeader({
  step,
  total,
  label,
  onBack,
}: {
  step: number;
  total: number;
  label: string;
  onBack: () => void;
}) {
  return (
    <div className="mb-6">
      <div className="relative mb-3 flex h-10 items-center justify-center">
        <button
          type="button"
          onClick={onBack}
          className="absolute left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white text-lg text-stone-700 shadow-sm"
          aria-label="Назад"
        >
          <ArrowIcon className="rotate-180" />
        </button>
        <p className="text-[22px] font-extrabold tracking-tight text-brand-600">
          {BRAND.name}
        </p>
      </div>
      <div className="flex gap-[5px]">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-[5px] flex-1 rounded-full ${
              i < step ? "bg-brand-500" : "bg-stone-200/90"
            }`}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[13px] text-stone-400">
        <span>{label}</span>
        <span>
          Шаг {step} из {total}
        </span>
      </div>
    </div>
  );
}

export function Title({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h1 className="text-[28px] font-extrabold leading-8 tracking-tight text-stone-950">
        {title}
      </h1>
      {subtitle ? (
        <p className="mt-2 text-[15px] leading-6 text-stone-500">{subtitle}</p>
      ) : null}
    </div>
  );
}

export function Choice({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full cursor-pointer rounded-[22px] border bg-white px-4 py-4 text-left text-[16px] font-semibold transition ${
        active
          ? "border-brand-500 bg-orange-50 text-brand-700"
          : "border-transparent text-stone-900 shadow-sm"
      }`}
    >
      {children}
    </button>
  );
}

export function LogoTile({
  name,
  letters,
  color,
  logo,
  active,
  onClick,
}: {
  name: string;
  letters: string;
  color: string;
  logo?: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex cursor-pointer flex-col items-center gap-2 rounded-[14px] border bg-white px-2 py-3 shadow-sm transition ${
        active ? "border-brand-500 bg-orange-50" : "border-transparent"
      }`}
    >
      {active ? (
        <span className="absolute right-2 top-2 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-extrabold text-white">
          ✓
        </span>
      ) : null}
      <span
        className="flex h-11 w-11 items-center justify-center rounded-2xl text-[11px] font-extrabold text-white"
        style={{ background: logo ? "#fff" : color }}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-9 w-9 object-contain" />
        ) : (
          <span className="text-[22px] leading-none">{letters}</span>
        )}
      </span>
      <span
        className={`text-center text-[12px] font-semibold leading-4 ${
          active ? "text-brand-600" : "text-stone-700"
        }`}
      >
        {name}
      </span>
    </button>
  );
}

export function FancySlider({
  min,
  max,
  step = 1,
  value,
  onChange,
  minLabel,
  maxLabel,
}: {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}) {
  const progress = `${Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))}%`;
  return (
    <div className="px-1">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(max, Math.max(min, value))}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--progress" as string]: progress }}
        className="fancy-range cursor-pointer"
      />
      {minLabel || maxLabel ? (
        <div className="mt-1 flex justify-between text-[12px] text-stone-400">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      ) : null}
    </div>
  );
}

export function NextBar({
  onNext,
  label = "Далее",
  disabled,
}: {
  onNext: () => void;
  label?: string;
  disabled?: boolean;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-20">
      <div className="pointer-events-auto mx-auto w-full max-w-[430px] bg-linear-to-t from-[#fbf6f0] via-[#fbf6f0] to-transparent px-5 pb-7 pt-8">
        <button
          type="button"
          disabled={disabled}
          onClick={onNext}
          className={
            disabled
              ? "flex w-full cursor-not-allowed items-center justify-center gap-1 rounded-full bg-linear-to-r from-[#FFDEB4] via-[#FFCDA4] to-[#FFBF99] py-[18px] text-[17px] font-extrabold text-stone-400"
              : "flex w-full cursor-pointer items-center justify-center gap-1 rounded-full bg-linear-to-r from-[#FFB15A] via-[#FF8A3D] to-[#FF6A1A] py-[18px] text-[17px] font-extrabold text-stone-950 shadow-[0_8px_24px_rgba(255,122,40,0.35)]"
          }
        >
          {label.replace(/[›>]\s*$/, "").trim()}
          <ArrowIcon />
        </button>
      </div>
    </div>
  );
}
