import { prisma } from "@/features/shared/lib/prisma";
import { buildOrdersWorkbook } from "@/features/shared/lib/excel";
import { buildOrderWhereInput } from "@/lib/order-filters";
import { requireAdmin } from "@/lib/server-utils";

export async function GET(req: Request) {
  await requireAdmin();
  const where = buildOrderWhereInput(new URL(req.url));
  const orders = await prisma.order.findMany({
    where,
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = orders.flatMap((o) =>
    o.items.length
      ? o.items.map((item) => ({
          "Order ID": o.id,
          Date: o.createdAt.toLocaleDateString("en-IN"),
          "Customer Name": o.customerName,
          Phone: o.phone,
          Address: o.address ?? "",
          Plant: item.plantName,
          Qty: item.quantity,
          "Unit Price (₹)": item.price,
          "Item Total (₹)": item.price * item.quantity,
          "Coupon Code": o.couponCode ?? "",
          "Discount (₹)": o.discount,
          "Order Total (₹)": o.total,
          Status: o.status,
          Message: o.message ?? "",
        }))
      : [
          {
            "Order ID": o.id,
            Date: o.createdAt.toLocaleDateString("en-IN"),
            "Customer Name": o.customerName,
            Phone: o.phone,
            Address: o.address ?? "",
            Plant: "",
            Qty: 0,
            "Unit Price (₹)": 0,
            "Item Total (₹)": 0,
            "Coupon Code": o.couponCode ?? "",
            "Discount (₹)": o.discount,
            "Order Total (₹)": o.total,
            Status: o.status,
            Message: o.message ?? "",
          },
        ],
  );

  const { buffer } = buildOrdersWorkbook(rows);
  const filename = `lions-nursery-orders-${new Date().toISOString().slice(0, 10)}.xlsx`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
