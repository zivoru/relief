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

## Деплой на VPS REG.RU (Docker + Postgres)

Нужен VPS Ubuntu 22.04, **от 2 ГБ RAM**, регион Россия. Домен `trackerlab.ru` остаётся в REG.RU.

1. Купи VPS, в панель попадёт IP. В DNS домена удали A-записи Тильды. Добавь:
   - A `@` → IP сервера
   - A `www` → IP сервера
2. На сервере:

```bash
sudo apt update && sudo apt install -y git docker.io docker-compose-plugin
sudo usermod -aG docker $USER && newgrp docker
git clone <твой-репозиторий> relief && cd relief
cp .env.example .env
nano .env
```

В `.env` обязательно:

```
PAYMENT_MODE=live
APP_URL=https://trackerlab.ru
POSTGRES_PASSWORD=длинный-случайный-пароль
DOMAIN=trackerlab.ru
ACME_EMAIL=team@trackerlab.ru
ROBOKASSA_LOGIN=...
ROBOKASSA_PASSWORD1=...
ROBOKASSA_PASSWORD2=...
ROBOKASSA_TEST=0
```

`DATABASE_URL` в `.env` для контейнера не важен — compose подставит Postgres на той же машине.

3. Запуск:

```bash
docker compose up -d --build
```

Сайт: `https://trackerlab.ru`. SSL выпустит Caddy сам, когда DNS уже смотрит на сервер.

4. В Robokassa: Result URL `https://trackerlab.ru/api/robokassa/result`.

Обновление: `git pull && docker compose up -d --build`.

Логи: `docker compose logs -f app`. Бэкап базы: `docker compose exec postgres pg_dump -U relief relief > backup.sql`.

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
