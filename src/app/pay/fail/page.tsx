import Link from "next/link";

export default function PayFailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">Оплата не прошла</h1>
      <p className="mt-3 text-sm text-stone-500">
        Можно вернуться и попробовать ещё раз — квиз проходить заново не нужно,
        если не закрывали вкладку.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-linear-to-r from-[#FFB15A] to-[#FF6A1A] px-6 py-3 font-extrabold text-stone-950"
      >
        На главную
      </Link>
    </div>
  );
}
