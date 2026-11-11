import { LegalShell } from "@/components/legal/LegalShell";
import { PRODUCT, SELLER, sellerLine } from "@/lib/legal";

export default function ContactsPage() {
  return (
    <LegalShell title="Контакты и реквизиты">
      <div className="rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[15px] font-extrabold text-stone-900">Связь</p>
        <p className="mt-2">
          Email:{" "}
          <a className="font-semibold text-brand-700 underline" href={`mailto:${SELLER.email}`}>
            {SELLER.email}
          </a>
        </p>
        <p className="mt-1">
          Телефон:{" "}
          <a className="font-semibold text-brand-700 underline" href={SELLER.phoneHref}>
            {SELLER.phone}
          </a>
        </p>
      </div>

      <div className="rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[15px] font-extrabold text-stone-900">Реквизиты</p>
        <p className="mt-2">{sellerLine()}</p>
        <p>
          Адрес: {SELLER.country}, {SELLER.city}
        </p>
      </div>

      <div className="rounded-[22px] bg-white p-4 shadow-sm">
        <p className="text-[15px] font-extrabold text-stone-900">Услуга</p>
        <p className="mt-2">{PRODUCT.name}</p>
        <p className="font-semibold text-brand-700">
          {PRODUCT.priceLabel} · {PRODUCT.paymentType}
        </p>
        <p className="mt-2 text-[13px] text-stone-500">{PRODUCT.delivery}</p>
      </div>
    </LegalShell>
  );
}
