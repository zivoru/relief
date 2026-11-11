import { LegalShell } from "@/components/legal/LegalShell";
import { SELLER, sellerLine } from "@/lib/legal";

export default function PrivacyPage() {
  return (
    <LegalShell title="Политика обработки персональных данных">
      <p>
        Политика составлена с учётом требований Федерального закона от
        27.07.2006 № 152-ФЗ «О персональных данных».
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">1. Оператор</h2>
      <p>
        {sellerLine()}.
        <br />
        Адрес: {SELLER.country}, {SELLER.city}.
        <br />
        Email:{" "}
        <a className="underline" href={`mailto:${SELLER.email}`}>
          {SELLER.email}
        </a>
        . Телефон: {SELLER.phone}.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">
        2. Какие данные обрабатываем
      </h2>
      <ul className="list-disc space-y-1 pl-5">
        <li>Адрес электронной почты</li>
        <li>
          Ответы квиза: пол, возраст, рост, вес, процент жира, активность,
          опыт, предпочтения в еде, аллергены, стоп-лист, магазин и бюджет
        </li>
        <li>
          Сведения скрининга здоровья — только при отдельном согласии на экране
          оплаты
        </li>
        <li>Технические данные (IP, метрика, UTM) и сведения о заказе</li>
      </ul>

      <h2 className="text-[17px] font-extrabold text-stone-900">3. Цели</h2>
      <p>
        Расчёт и доставка плана, исполнение договора, связь по заказу,
        бухгалтерия/чеки при необходимости, улучшение сервиса.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">4. Передача</h2>
      <p>
        Платёжные данные карт обрабатывает Robokassa — мы не храним номера карт.
        Для писем может использоваться почтовый сервис.
      </p>

      <h2 className="text-[17px] font-extrabold text-stone-900">5. Срок и права</h2>
      <p>
        Данные хранятся не дольше, чем нужно для услуги и требований закона. Для
        доступа, уточнения или удаления напишите на {SELLER.email}.
      </p>
    </LegalShell>
  );
}
