import { Suspense } from "react";
import { PaySuccessClient } from "./PaySuccessClient";

async function PaySuccessInner({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const q = await searchParams;
  const one = (key: string) => {
    const v = q[key] ?? q[key.toLowerCase()] ?? q[key[0] + key.slice(1)];
    return Array.isArray(v) ? v[0] : (v ?? "");
  };
  return (
    <PaySuccessClient
      invId={one("InvId") || one("invId")}
      token={one("token")}
      outSum={one("OutSum")}
      signature={one("SignatureValue")}
    />
  );
}

export default function PaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-dvh max-w-md items-center justify-center px-4 text-center">
          Подтверждаем оплату…
        </div>
      }
    >
      <PaySuccessInner searchParams={searchParams} />
    </Suspense>
  );
}
