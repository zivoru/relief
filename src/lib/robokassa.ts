import crypto from "node:crypto";

function md5(value: string): string {
  return crypto.createHash("md5").update(value).digest("hex");
}

export function getRobokassaConfig() {
  return {
    login: process.env.ROBOKASSA_LOGIN ?? "",
    password1: process.env.ROBOKASSA_PASSWORD1 ?? "",
    password2: process.env.ROBOKASSA_PASSWORD2 ?? "",
    isTest: process.env.ROBOKASSA_TEST !== "0",
    appUrl: process.env.APP_URL ?? "http://localhost:3000",
  };
}

export function formatAmount(rub: number): string {
  return rub.toFixed(2);
}

export function buildReceipt(amountRub: string) {
  return {
    sno: "usn_income",
    items: [
      {
        name: "Персональный план Рельеф на 14 дней",
        quantity: 1,
        sum: Number(amountRub),
        tax: "none",
        payment_method: "full_payment",
        payment_object: "service",
      },
    ],
  };
}

export function paymentSignature(params: {
  login: string;
  amount: string;
  invId: number;
  password1: string;
  receipt?: string;
}): string {
  const parts = [params.login, params.amount, String(params.invId)];
  if (params.receipt) parts.push(params.receipt);
  parts.push(params.password1);
  return md5(parts.join(":"));
}

export function resultSignature(params: {
  amount: string;
  invId: number;
  password2: string;
}): string {
  return md5(`${params.amount}:${params.invId}:${params.password2}`);
}

export function buildPaymentUrl(input: {
  invId: number;
  amount: string;
  email?: string;
  token: string;
}): string {
  const cfg = getRobokassaConfig();
  const receiptObj = buildReceipt(input.amount);
  const receipt = encodeURIComponent(JSON.stringify(receiptObj));
  const signature = paymentSignature({
    login: cfg.login,
    amount: input.amount,
    invId: input.invId,
    password1: cfg.password1,
    receipt: JSON.stringify(receiptObj),
  });

  const url = new URL("https://auth.robokassa.ru/Merchant/Index.aspx");
  url.searchParams.set("MerchantLogin", cfg.login);
  url.searchParams.set("OutSum", input.amount);
  url.searchParams.set("InvId", String(input.invId));
  url.searchParams.set("Description", "Персональный план сушки 14 дней");
  url.searchParams.set("SignatureValue", signature);
  url.searchParams.set("Receipt", receipt);
  url.searchParams.set("Culture", "ru");
  url.searchParams.set("Encoding", "utf-8");
  url.searchParams.set(
    "SuccessURL",
    `${cfg.appUrl}/pay/success?invId=${input.invId}&token=${input.token}`,
  );
  url.searchParams.set("FailURL", `${cfg.appUrl}/pay/fail?invId=${input.invId}`);
  if (input.email) url.searchParams.set("Email", input.email);
  if (cfg.isTest) url.searchParams.set("IsTest", "1");
  return url.toString();
}
