import { Suspense } from "react";
import { PaySuccessClient } from "./PaySuccessClient";

async function PaySuccessInner({
  searchParams,
}: {
  searchParams: Promise<{ invId?: string; token?: string }>;
}) {
  const q = await searchParams;
  return <PaySuccessClient invId={q.invId ?? ""} token={q.token ?? ""} />;
}

export default function PaySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invId?: string; token?: string }>;
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
