export async function notifyPaid(input: {
  invId: number;
  amountRub: string;
  email?: string | null;
  token: string;
  forecastLabel?: string;
  sex?: string;
  isTest?: boolean;
}): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const plan = `${appUrl}/plan/${input.token}`;
  const sex =
    input.sex === "female" ? "женщина" : input.sex === "male" ? "мужчина" : "—";
  const test = input.isTest ? " (тест)" : "";
  const text = [
    `Оплата «Рельеф»${test}`,
    `Заказ #${input.invId} · ${input.amountRub} ₽`,
    `Email: ${input.email ?? "—"}`,
    `Пол: ${sex}`,
    input.forecastLabel ? input.forecastLabel : null,
    plan,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) {
      console.error("telegram notify failed", await res.text());
    }
  } catch (error) {
    console.error("telegram notify failed", error);
  }
}
