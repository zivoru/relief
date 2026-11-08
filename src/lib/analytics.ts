declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: unknown[]) => void;
  }
}

export function trackGoal(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const id = Number(process.env.NEXT_PUBLIC_YM_ID);
  if (!id || !window.ym) return;
  window.ym(id, "reachGoal", name, params);
}
