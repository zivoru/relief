import { markOrderPaid } from "@/lib/order-paid";
import { getRobokassaConfig, resultSignature } from "@/lib/robokassa";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    outSum?: string;
    invId?: string | number;
    signature?: string;
  };
  const outSum = String(body.outSum ?? "");
  const invId = Number(body.invId ?? 0);
  const signature = String(body.signature ?? "").toLowerCase();
  const cfg = getRobokassaConfig();

  const expected = resultSignature({
    amount: outSum,
    invId,
    password2: cfg.password1,
  }).toLowerCase();

  if (!invId || !outSum || signature !== expected) {
    return Response.json({ error: "bad sign" }, { status: 400 });
  }

  const order = await markOrderPaid(invId);
  if (!order) {
    return Response.json({ error: "not found" }, { status: 404 });
  }

  return Response.json({
    status: order.status,
    token: order.token,
    planStatus: order.quiz.plan?.status ?? "generating",
  });
}
