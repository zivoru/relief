export async function sendPlanEmail(input: {
  to: string;
  token: string;
  forecastLabel: string;
}): Promise<void> {
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  const link = `${appUrl}/plan/${input.token}`;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Рельеф <noreply@localhost>";

  if (!apiKey) {
    console.log(`[email:stub] ${input.to} -> ${link}`);
    return;
  }

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: "Ваш план Рельеф готов",
      html: `<p>План готов: ${input.forecastLabel}.</p><p><a href="${link}">Открыть план</a></p><p>PDF: <a href="${appUrl}/api/plan/${input.token}/pdf">скачать</a></p>`,
    }),
  });
}
