import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { couponPatchSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = couponPatchSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.code) {
    data.code = String(parsed.data.code).trim().toUpperCase();
  }
  if (parsed.data.expiresAt !== undefined) {
    data.expiresAt = parsed.data.expiresAt
      ? new Date(parsed.data.expiresAt)
      : null;
  }
  const coupon = await prisma.coupon.update({
    where: { id },
    data,
  });
  return Response.json(coupon);
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  await prisma.coupon.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
