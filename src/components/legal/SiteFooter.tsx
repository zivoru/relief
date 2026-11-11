import Link from "next/link";
import { BRAND } from "@/lib/brand";
import { PRODUCT, SELLER, sellerLine } from "@/lib/legal";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer className="mt-10 border-t border-stone-200/80 pt-6 text-left text-[12px] leading-5 text-stone-400">
      {!compact ? (
        <div className="mb-4 rounded-[22px] bg-white p-4 shadow-sm">
          <p className="text-[13px] font-extrabold text-stone-800">
            {PRODUCT.name}
          </p>
          <p className="mt-1 text-[13px] font-semibold text-brand-700">
            {PRODUCT.priceLabel} · {PRODUCT.paymentType}
          </p>
          <p className="mt-2 text-[12px] leading-5 text-stone-500">
            {PRODUCT.delivery}
          </p>
        </div>
      ) : null}

      <p className="font-semibold text-stone-500">{BRAND.name}</p>
      <p className="mt-1">{sellerLine()}</p>
      <p>
        Адрес: {SELLER.country}, {SELLER.city}
      </p>
      <p>
        Email:{" "}
        <a className="underline" href={`mailto:${SELLER.email}`}>
          {SELLER.email}
        </a>
      </p>
      <p>
        Телефон:{" "}
        <a className="underline" href={SELLER.phoneHref}>
          {SELLER.phone}
        </a>
      </p>

      <nav className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
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

      <p className="mt-4 text-[11px] text-stone-300">
        © {new Date().getFullYear()} {SELLER.fullName}. Все права защищены.
      </p>
    </footer>
  );
}
