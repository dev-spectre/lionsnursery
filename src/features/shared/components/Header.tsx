"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SiteSettings } from "@/generated/prisma";
import { BUSINESS } from "@/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Menu, Leaf, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header({ settings }: { settings: SiteSettings | null }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const siteName = settings?.siteName ?? BUSINESS.name;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-base",
        scrolled
          ? "border-border/80 bg-white/80 shadow-sm backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-botanical-text"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-botanical-primary-light text-botanical-primary">
            <Leaf className="h-5 w-5" aria-hidden />
          </span>
          {siteName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => {
            const active =
              l.href === "/"
                ? pathname === "/"
                : l.href.startsWith("/plants")
                  ? pathname.startsWith("/plants")
                  : false;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "relative text-sm font-medium text-botanical-text-muted transition-colors hover:text-botanical-primary",
                  active && "text-botanical-primary",
                )}
              >
                {l.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 rounded-full bg-botanical-primary transition-transform duration-base",
                    active && "scale-x-100",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/plants"
            className={cn(
              buttonVariants(),
              "rounded-full bg-primary px-6 text-primary-foreground shadow-none transition-transform duration-base hover:-translate-y-0.5 hover:bg-botanical-primary-hover",
            )}
          >
            Order Now
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border bg-white/95 backdrop-blur-md transition-[max-height] duration-base md:hidden",
          open ? "max-h-96" : "max-h-0 border-transparent",
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-botanical-text hover:bg-botanical-primary-light"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/plants"
            onClick={() => setOpen(false)}
            className={cn(buttonVariants(), "mt-2 rounded-full")}
          >
            Order Now
          </Link>
        </nav>
      </div>
    </header>
  );
}
