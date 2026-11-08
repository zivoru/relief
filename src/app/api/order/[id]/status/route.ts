import { prisma } from "@/lib/db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const order = await prisma.order.findUnique({
    where: { id: Number(id) },
    include: { quiz: { include: { plan: true } } },
  });
  if (!order) {
    return Response.json({ error: "not found" }, { status: 404 });
  }
  return Response.json({
    status: order.status,
    token: order.status === "paid" ? order.token : null,
    planStatus: order.quiz.plan?.status ?? "generating",
  });
}
