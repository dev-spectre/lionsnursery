import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/features/shared/lib/prisma";
import { buildOrderWhereInput } from "@/lib/order-filters";
import { requireAdmin } from "@/lib/server-utils";
import { orderCreateSchema } from "@/lib/validations";

export async function GET(req: Request) {
  await requireAdmin();
  const where = buildOrderWhereInput(new URL(req.url));
  const [total, orders] = await prisma.$transaction([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        coupon: true,
      },
      take: 500,
    }),
  ]);
  return Response.json({ orders, total });
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = orderCreateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const plantIds = [...new Set(body.items.map((i) => i.plantId))];

  try {
    const order = await prisma.$transaction(async (tx) => {
      const plants = await tx.plant.findMany({
        where: {
          id: { in: plantIds },
          deletedAt: null,
          inStock: true,
        },
      });
      if (plants.length !== plantIds.length) {
        throw new Error("INVALID_PLANTS");
      }

      let subtotal = 0;
      const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];
      for (const line of body.items) {
        const plant = plants.find((p) => p.id === line.plantId)!;
        subtotal += plant.price * line.quantity;
        orderItems.push({
          plant: { connect: { id: plant.id } },
          plantName: plant.name,
          price: plant.price,
          quantity: line.quantity,
        });
      }

      let discount = 0;
      let couponId: string | null = null;
      let couponCodeNorm: string | null =
        body.couponCode?.trim().toUpperCase() || null;

      if (couponCodeNorm) {
        const coupon = await tx.coupon.findUnique({
          where: { code: couponCodeNorm },
        });
        const valid =
          coupon &&
          coupon.active &&
          (!coupon.expiresAt || coupon.expiresAt > new Date()) &&
          (coupon.maxUses == null || coupon.usedCount < coupon.maxUses);
        if (valid) {
          discount = (subtotal * coupon.discount) / 100;
          couponId = coupon.id;
        } else {
          couponCodeNorm = null;
        }
      }

      const total = Math.max(0, subtotal - discount);

      const created = await tx.order.create({
        data: {
          customerName: body.customerName,
          phone: body.phone,
          address: body.address ?? null,
          message: body.message ?? null,
          couponCode: couponCodeNorm,
          couponId,
          subtotal,
          discount,
          total,
          items: { create: orderItems },
        },
      });

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      return created;
    });

    return Response.json({ orderId: order.id }, { status: 201 });
  } catch (e) {
    if (e instanceof Error && e.message === "INVALID_PLANTS") {
      return Response.json(
        { error: "One or more plants are unavailable." },
        { status: 400 },
      );
    }
    console.error(e);
    return Response.json({ error: "Order failed" }, { status: 500 });
  }
}
