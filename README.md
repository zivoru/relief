# Рельеф — сушка за 14 дней без потери мышц

Одностраничный квиз: пользователь проходит 10 шагов, видит прогноз по жиру и покупает персональный план на 14 дней (меню, рефиды, тренировки, выход из диеты).

Цифры считает код по формулам PSMF. Нейросеть только оформляет меню. Если `LLM_API_KEY` не задан, используется шаблонный план.

## Запуск

```bash
npm install
npx prisma db push
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

Пока `PAYMENT_MODE=mock` или не заполнен `ROBOKASSA_LOGIN`, оплата пропускается и сразу открывается план.

## Переменные окружения

Скопируйте `.env.example` в `.env`.

- `ROBOKASSA_*` — боевая оплата. ResultURL: `https://ваш-домен/api/robokassa/result`
- `LLM_API_KEY` / `LLM_API_URL` / `LLM_MODEL` — OpenAI-совместимый API или YandexGPT
- `RESEND_API_KEY` — письмо со ссылкой на план
- `NEXT_PUBLIC_YM_ID` — Яндекс Метрика, цели: `quiz_start`, `quiz_step_N`, `quiz_complete`, `checkout_start`

Для продакшена замените SQLite в `prisma/schema.prisma` на PostgreSQL (Neon) и поменяйте `DATABASE_URL`.

## UTM для рилсов

Каждый ролик ведите на `/?utm_source=instagram&utm_campaign=reel_1`.
