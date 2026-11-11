import { LegalShell } from "@/components/legal/LegalShell";
import { PRODUCT, SELLER, sellerLine } from "@/lib/legal";

export default function OfferPage() {
  return (
    <LegalShell title="Публичная оферта">
      <p>
        Настоящий документ является официальным предложением (публичной офертой)
        в адрес любого физического лица заключить договор на оказание
        информационной услуги на условиях ниже. Акцептом оферты считается оплата
        услуги и/или проставление согласий на экране оплаты.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">1. Исполнитель</h2>
      <p>
        {sellerLine()}.
        <br />
        Адрес: {SELLER.country}, {SELLER.city}.
        <br />
        Email: {SELLER.email}. Телефон: {SELLER.phone}.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">2. Предмет</h2>
      <p>
        Исполнитель оказывает Заказчику информационную услугу:{" "}
        <strong>{PRODUCT.name}</strong> — формирование персонального плана
        питания и тренировок на основе ответов квиза.
      </p>
      <ul className="list-disc space-y-1 pl-5">
        {PRODUCT.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>{PRODUCT.disclaimer}</p>

      <h2 className="text-[17px] font-extrabold text-stone-900">3. Стоимость и оплата</h2>
      <p>
        Стоимость услуги: <strong>{PRODUCT.priceLabel}</strong>.{" "}
        {PRODUCT.paymentType}. Оплата через Robokassa (карты, СБП и другие
        способы на странице оплаты). Моментом заключения договора считается
        успешная оплата.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        4. Порядок оказания
      </h2>
      <p>{PRODUCT.delivery}</p>
      <p>
        Услуга считается оказанной в момент предоставления доступа к странице
        плана по уникальной ссылке и/или направления ссылки (или PDF) на email
        Заказчика.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">5. Возврат</h2>
      <p>
        Условия отказа и возврата — на странице{" "}
        <a className="font-semibold text-brand-700 underline" href="/refund">
          «Возврат»
        </a>
        . Кратко: до предоставления доступа — полный возврат; после выдачи
        цифрового доступа услуга оказана, возврат — при технической
        невозможности получить план по вине Исполнителя.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">6. Ответственность</h2>
      <p>
        Исполнитель не несёт ответственности за результаты применения плана и
        самочувствие Заказчика. Перед жёстким дефицитом калорий
        проконсультируйтесь с врачом.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">7. Персональные данные</h2>
      <p>
        Обработка ПДн — по{" "}
        <a className="font-semibold text-brand-700 underline" href="/privacy">
          Политике обработки ПДн
        </a>
        .
      </p>

      <p className="text-[12px] text-stone-400">
        Редакция оферты от 12.11.2026.
      </p>
    </LegalShell>
  );
}
