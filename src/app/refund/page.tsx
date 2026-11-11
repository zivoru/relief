import { LegalShell } from "@/components/legal/LegalShell";
import { PRODUCT, SELLER } from "@/lib/legal";

export default function RefundPage() {
  return (
    <LegalShell title="Возврат и отказ от покупки">
      <p>
        Услуга «{PRODUCT.name}» — цифровая. Физическая доставка не
        осуществляется.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        Как предоставляется услуга
      </h2>
      <p>{PRODUCT.delivery}</p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        Отказ до получения плана
      </h2>
      <p>
        Если оплата прошла, но доступ ещё не предоставлен, запросите полный
        возврат на {SELLER.email}, указав email оплаты и время платежа.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        После предоставления доступа
      </h2>
      <p>
        С момента открытия страницы плана или получения письма со ссылкой/PDF
        услуга считается оказанной. Возврат возможен, если план нельзя получить
        по вине Исполнителя и проблему не устранили в срок до 3 рабочих дней.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        Как оформить возврат
      </h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>
          Напишите на{" "}
          <a className="underline" href={`mailto:${SELLER.email}`}>
            {SELLER.email}
          </a>{" "}
          или позвоните{" "}
          <a className="underline" href={SELLER.phoneHref}>
            {SELLER.phone}
          </a>
          .
        </li>
        <li>Укажите email оплаты, дату, сумму и причину.</li>
        <li>Ответ — в течение 3 рабочих дней; возврат через Robokassa.</li>
        <li>Зачисление на карту обычно 1–10 рабочих дней после возврата.</li>
      </ol>
    </LegalShell>
  );
}
