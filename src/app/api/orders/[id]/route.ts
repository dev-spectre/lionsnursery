import { OrderStatus } from "@/generated/prisma";
import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { orderStatusSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = orderStatusSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status as OrderStatus },
    include: { items: true },
  });
  return Response.json(order);
}
