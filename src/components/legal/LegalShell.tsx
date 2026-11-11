import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { SELLER, sellerLine } from "@/lib/legal";

export function LegalShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto max-w-[430px] px-5 py-8 text-[14px] leading-6 text-stone-700">
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/" className="text-[13px] text-stone-400">
          ← На главную
        </Link>
        <p className="text-[15px] font-extrabold text-brand-600">{BRAND.name}</p>
      </div>
      <h1 className="text-[26px] font-extrabold leading-8 tracking-tight text-stone-950">
        {title}
      </h1>
      <div className="mt-5 space-y-4">{children}</div>
      <footer className="mt-10 border-t border-stone-200 pt-5 text-[12px] leading-5 text-stone-400">
        <p>{sellerLine()}</p>
        <p>
          {SELLER.country}, {SELLER.city}
        </p>
        <p>
          <a className="underline" href={`mailto:${SELLER.email}`}>
            {SELLER.email}
          </a>
          {" · "}
          <a className="underline" href={SELLER.phoneHref}>
            {SELLER.phone}
          </a>
        </p>
        <nav className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
          <Link href="/offer" className="underline">
            Оферта
          </Link>
          <Link href="/refund" className="underline">
            Возврат
          </Link>
          <Link href="/privacy" className="underline">
            Политика ПДн
          </Link>
          <Link href="/contacts" className="underline">
            Контакты
          </Link>
        </nav>
      </footer>
    </article>
  );
}
