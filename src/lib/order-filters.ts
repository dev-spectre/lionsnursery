import type { Prisma } from "@/generated/prisma";
import { OrderStatus } from "@/generated/prisma";

/** Build Prisma `where` for admin order list + export from URL search params. */
export function buildOrderWhereInput(url: URL): Prisma.OrderWhereInput {
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  const coupon = url.searchParams.get("coupon")?.trim() ?? "";

  const where: Prisma.OrderWhereInput = {};
  const createdAt: Prisma.DateTimeFilter = {};
  if (from) createdAt.gte = new Date(from);
  if (to) createdAt.lte = new Date(to);
  if (Object.keys(createdAt).length) where.createdAt = createdAt;
  if (status && status !== "ALL") {
    where.status = status as OrderStatus;
  }

  const and: Prisma.OrderWhereInput[] = [];
  if (search?.trim()) {
    const q = search.trim();
    and.push({
      OR: [
        { customerName: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  const couponUpper = coupon.toUpperCase();
  if (couponUpper === "NONE") {
    and.push({
      OR: [{ couponCode: null }, { couponCode: "" }],
    });
  } else if (coupon && couponUpper !== "ALL") {
    and.push({ couponCode: couponUpper });
  }
  if (and.length) {
    where.AND = and;
  }
  return where;
}
