import { markOrderPaid } from "@/lib/order-paid";
import { getRobokassaConfig, resultSignature } from "@/lib/robokassa";

function pick(form: URLSearchParams, name: string) {
  return form.get(name) ?? form.get(name.toLowerCase()) ?? "";
}

async function handle(form: URLSearchParams) {
  const outSum = pick(form, "OutSum");
  const invId = Number(pick(form, "InvId") || "0");
  const signature = pick(form, "SignatureValue").toLowerCase();
  const cfg = getRobokassaConfig();

  const expected = resultSignature({
    amount: outSum,
    invId,
    password2: cfg.password2,
  }).toLowerCase();

  if (!invId || signature !== expected) {
    console.error("robokassa result bad sign", { outSum, invId, signature, expected });
    return new Response("bad sign", { status: 400 });
  }

  const order = await markOrderPaid(invId);
  if (!order) return new Response("not found", { status: 404 });

  return new Response(`OK${invId}`);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("json")) {
    const body = (await request.json()) as Record<string, string>;
    return handle(new URLSearchParams(body));
  }
  const text = await request.text();
  return handle(new URLSearchParams(text));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  return handle(url.searchParams);
}
