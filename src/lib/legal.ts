import { BRAND } from "@/lib/brand";
import { PRICE_RUB } from "@/lib/psmf/config";

export const SELLER = {
  label: "Самозанятый",
  fullName: "Зимин Владимир Владимирович",
  inn: "591405085301",
  city: "г. Пермь",
  country: "Россия",
  email: "team@trackerlab.ru",
  phone: "+7 (919) 713-51-38",
  phoneHref: "tel:+79197135138",
};

export const PRODUCT = {
  name: `Персональный план «${BRAND.name}» на 14 дней`,
  shortName: BRAND.name,
  priceRub: PRICE_RUB,
  priceLabel: `${PRICE_RUB.toLocaleString("ru-RU")} ₽`,
  paymentType: "Разовая оплата, без подписки",
  delivery:
    "Цифровая услуга: доступ к плану на сайте и/или PDF по ссылке на email сразу после оплаты (обычно в течение нескольких минут).",
  includes: [
    "Расчёт калорий, белка, жиров и углеводов под ваши параметры",
    "Меню на период фазы с учётом вкусов и ограничений",
    "Рекомендации по рефидам и выходу из дефицита",
    "Силовые тренировки под выбранный зал или дом",
    "Список покупок",
    "Скачивание PDF",
  ],
  disclaimer:
    "Материал носит информационный характер и не является медицинской услугой, диагнозом или индивидуальной медицинской рекомендацией.",
};

export function sellerLine() {
  return `${SELLER.label} ${SELLER.fullName}, ИНН ${SELLER.inn}`;
}
