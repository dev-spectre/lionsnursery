import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { couponCreateSchema } from "@/lib/validations";

function couponValid(c: {
  active: boolean;
  expiresAt: Date | null;
  maxUses: number | null;
  usedCount: number;
}) {
  if (!c.active) return false;
  if (c.expiresAt && c.expiresAt <= new Date()) return false;
  if (c.maxUses != null && c.usedCount >= c.maxUses) return false;
  return true;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const normalized = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: normalized },
    });
    if (!coupon || !couponValid(coupon)) {
      return Response.json({ valid: false }, { status: 400 });
    }
    return Response.json({
      valid: true,
      code: coupon.code,
      discount: coupon.discount,
    });
  }

  await requireAdmin();
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
  return Response.json(coupons);
}

export async function POST(req: Request) {
  await requireAdmin();
  const json = await req.json().catch(() => null);
  const parsed = couponCreateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const expiresAt = parsed.data.expiresAt
    ? new Date(parsed.data.expiresAt)
    : null;
  const coupon = await prisma.coupon.create({
    data: {
      code: parsed.data.code.trim().toUpperCase(),
      discount: parsed.data.discount,
      maxUses: parsed.data.maxUses ?? null,
      active: parsed.data.active ?? true,
      expiresAt,
    },
  });
  return Response.json(coupon, { status: 201 });
}
