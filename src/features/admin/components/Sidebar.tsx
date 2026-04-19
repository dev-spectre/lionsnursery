"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Leaf,
  Tags,
  Ticket,
  Images,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/plants", label: "Plants", icon: Leaf },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/hero", label: "Hero Carousel", icon: Images },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-border bg-card py-6">
      <div className="px-4 font-display text-lg font-bold text-botanical-text">
        Admin
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-1 px-2">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/admin/dashboard" &&
              pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-botanical-primary-light text-botanical-primary"
                  : "text-botanical-text-muted hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-2">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start rounded-full"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
