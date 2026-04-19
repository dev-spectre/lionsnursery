import Image from "next/image";
import type { SiteSettings } from "@prisma/client";
import { BUSINESS } from "@/constants";
import { Award, Leaf, Truck } from "lucide-react";

const FALLBACK_TITLE = "Growing Green, Growing Together";
const FALLBACK_BODY = `Since ${BUSINESS.established}, Lions Landscape Nursery has stood as Coimbatore's premier destination for high-quality flora, dedicated to elevating the standard of local horticulture. Tucked away in the serene enclave of Kurumbapalayam, our facility operates on a rigorous philosophy of quality over convenience. Our team meticulously selects every sapling, shrub, and exotic specimen, conducting thorough health inspections to guarantee unmatched vitality. We don't simply sell plants; we ensure that every piece of greenery you introduce to your home is robust, well-acclimated, and prepared to flourish. For us, gardening is a committed partnership in creating thriving, sustainable, and vibrant outdoor landscapes.`;

const stats = [
  { icon: Leaf, label: "500+ plants delivered", sub: "Across Coimbatore" },
  { icon: Truck, label: "100% healthy guarantee", sub: "Hand-picked quality" },
  { icon: Award, label: `Since ${BUSINESS.established}`, sub: "Trusted nursery" },
] as const;

export function AboutSection({ settings }: { settings: SiteSettings | null }) {
  const title = settings?.aboutTitle ?? FALLBACK_TITLE;
  const body = settings?.aboutBody ?? FALLBACK_BODY;

  return (
    <section id="about" className="py-20 md:py-28 min-[95vh]">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="relative">
          <div className="overflow-hidden rounded-xl shadow-lg ring-1 ring-border">
            <Image
              src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80"
              alt="Lush greenhouse plants"
              width={640}
              height={480}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl font-bold text-botanical-text md:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-[1.75] my-5 text-botanical-text-muted md:text-lg md:leading-relaxed">
            {body}
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            {stats.map(({ icon: Icon, label, sub }) => (
              <li
                key={label}
                className="rounded-xl border border-botanical-border/80 bg-card/90 p-4 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <Icon
                  className="h-6 w-6 text-botanical-primary"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <p className="mt-3 text-sm font-semibold text-botanical-text">
                  {label}
                </p>
                <p className="mt-1 text-xs text-botanical-text-muted">{sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
