"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function PaySuccessClient({
  invId,
  token,
}: {
  invId: string;
  token: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState("Ждём подтверждение оплаты…");

  useEffect(() => {
    if (!invId) return;
    let cancelled = false;
    const tick = async () => {
      const res = await fetch(`/api/order/${invId}/status`);
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as {
        status: string;
        token: string | null;
        planStatus: string;
      };
      if (data.status === "paid" && data.token) {
        if (data.planStatus === "ready") {
          router.replace(`/plan/${data.token}`);
          return;
        }
        setStatus("Оплата прошла, собираем меню…");
      }
    };
    void tick();
    const id = setInterval(() => void tick(), 1500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [invId, router]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 h-12 w-12 animate-pulse rounded-full bg-linear-to-br from-brand-400 to-brand-600" />
      <h1 className="text-2xl font-semibold">{status}</h1>
      <p className="mt-2 text-sm text-stone-500">Не закрывайте страницу.</p>
      {token ? (
        <a href={`/plan/${token}`} className="mt-6 text-sm underline">
          Открыть план вручную
        </a>
      ) : null}
    </div>
  );
}
