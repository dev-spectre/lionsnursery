import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          className="rounded-2xl overflow-hidden text-center text-white shadow-lg"
          style={{
            background:
              "url('/images/ctabg.webp') no-repeat center center / cover",
          }}
        >
          <div className="flex flex-col items-center justify-center bg-black/55 px-6 py-16 md:px-16 md:py-24">
            <h2 className="font-display text-3xl font-bold md:text-4xl">
              Bring home your next favourite plant
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 md:text-lg">
              Browse our curated collection, build your cart, and we will call you to confirm delivery.
            </p>
            <Link
              href="/plants"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 rounded-full bg-white px-10 text-botanical-primary shadow-none hover:-translate-y-0.5 hover:bg-white/95",
              )}
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
