import Link from "next/link";
import { prisma } from "@/features/shared/lib/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const [plants, categories, coupons, ordersMonth, recent] = await Promise.all([
    prisma.plant.count({ where: { deletedAt: null } }),
    prisma.category.count(),
    prisma.coupon.count({ where: { active: true } }),
    prisma.order.count({ where: { createdAt: { gte: start } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { items: true },
    }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your nursery operations.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total plants
            </CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold">
            {plants}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold">
            {categories}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active coupons
            </CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold">
            {coupons}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-border shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Orders this month
            </CardTitle>
          </CardHeader>
          <CardContent className="font-display text-3xl font-bold">
            {ordersMonth}
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recent orders</h2>
          <Link
            href="/admin/orders"
            className={cn(buttonVariants({ variant: "outline" }), "rounded-full")}
          >
            View all
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map((o) => (
                <TableRow key={o.id}>
                  <TableCell>
                    {new Date(o.createdAt).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>₹{o.total.toFixed(0)}</TableCell>
                  <TableCell>{o.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
