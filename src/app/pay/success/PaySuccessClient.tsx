"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function PaySuccessClient({
  invId,
  token,
  outSum,
  signature,
}: {
  invId: string;
  token: string;
  outSum: string;
  signature: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState("Ждём подтверждение оплаты…");
  const [planToken, setPlanToken] = useState(token);
  const confirmed = useRef(false);

  useEffect(() => {
    if (!invId) return;
    let cancelled = false;

    const confirm = async () => {
      if (!outSum || !signature || confirmed.current) return;
      confirmed.current = true;
      const res = await fetch("/api/robokassa/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outSum, invId, signature }),
      });
      if (!res.ok) confirmed.current = false;
    };

    const tick = async () => {
      await confirm();
      const res = await fetch(`/api/order/${invId}/status`);
      if (!res.ok || cancelled) return;
      const data = (await res.json()) as {
        status: string;
        token: string | null;
        planStatus: string;
      };
      if (data.status === "paid" && data.token) {
        setPlanToken(data.token);
        if (data.planStatus === "ready") {
          router.replace(`/plan/${data.token}`);
          return;
        }
        if (data.planStatus === "error") {
          setStatus("План не собрался. Напиши на почту из контактов — доступ выдадим.");
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
  }, [invId, outSum, signature, router]);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-linear-to-br from-brand-400 to-brand-600 text-3xl">
        🥗
      </div>
      <h1 className="text-2xl font-extrabold">{status}</h1>
      <p className="mt-2 text-sm text-stone-500">Не закрывайте страницу.</p>
      {planToken ? (
        <a href={`/plan/${planToken}`} className="mt-6 text-sm underline">
          Открыть план вручную
        </a>
      ) : null}
    </div>
  );
}
