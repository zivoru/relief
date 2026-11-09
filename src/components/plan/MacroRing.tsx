export function MacroRing({
  label,
  value,
  unit,
  percent,
  color,
}: {
  label: string;
  value: string;
  unit: string;
  percent: number;
  color: string;
}) {
  const r = 28;
  const c = 2 * Math.PI * r;
  const p = Math.max(0.08, Math.min(1, percent));
  return (
    <div className="flex flex-col items-center">
      <svg width="84" height="84" viewBox="0 0 84 84" aria-hidden>
        <circle cx="42" cy="42" r={r} fill="none" stroke="#F3E8DC" strokeWidth="8" />
        <circle
          cx="42"
          cy="42"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${c * p} ${c}`}
          transform="rotate(-90 42 42)"
        />
        <text
          x="42"
          y="40"
          textAnchor="middle"
          className="fill-stone-950"
          style={{ fontSize: 13, fontWeight: 800 }}
        >
          {value}
        </text>
        <text
          x="42"
          y="54"
          textAnchor="middle"
          className="fill-stone-400"
          style={{ fontSize: 9, fontWeight: 600 }}
        >
          {unit}
        </text>
      </svg>
      <p className="mt-1 text-[11px] font-semibold text-stone-500">{label}</p>
    </div>
  );
}

export function CalorieBar({
  diet,
  maintenance,
}: {
  diet: number;
  maintenance: number;
}) {
  const max = Math.max(diet, maintenance, 1);
  return (
    <div className="space-y-3">
      <BarRow label="Фаза" value={diet} max={max} color="#FF8A4C" />
      <BarRow label="Поддержка" value={maintenance} max={max} color="#D6D3D1" dark />
    </div>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
  dark,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  dark?: boolean;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span className="font-semibold text-stone-500">{label}</span>
        <span className="font-extrabold text-stone-900">
          {value.toLocaleString("ru-RU")} ккал
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-[#F3E8DC]">
        <div
          className={`h-full rounded-full ${dark ? "" : "shadow-[0_0_12px_rgba(255,138,76,0.45)]"}`}
          style={{ width: `${Math.round((value / max) * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
