import Image from "next/image";
import type { SiteSettings } from "@/generated/prisma";
import { BUSINESS } from "@/constants";

const FALLBACK_TITLE = "Growing Green, Growing Together";
const FALLBACK_BODY = `Lions Landscape Nursery has been cultivating quality plants and spreading the joy of gardening across Coimbatore since ${BUSINESS.established}. Nestled in the green heart of Kurumbapalayam, we carefully hand-pick every plant to ensure it arrives at your home healthy, vibrant, and ready to thrive. Whether you're a seasoned gardener or just starting your green journey, our expert team is here to guide you every step of the way.`;

export function AboutSection({ settings }: { settings: SiteSettings | null }) {
  const title = settings?.aboutTitle ?? FALLBACK_TITLE;
  const body = settings?.aboutBody ?? FALLBACK_BODY;

  return (
    <section id="about" className="py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 md:grid-cols-2 md:px-6">
        <div className="relative">
          <div className="rotate-1 overflow-hidden rounded-xl shadow-lg ring-1 ring-border">
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
          <p className="mt-6 text-base leading-relaxed text-botanical-text-muted md:text-lg">
            {body}
          </p>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-botanical-text">
            <span>500+ Plants Delivered</span>
            <span className="text-botanical-border-strong">·</span>
            <span>100% Healthy Guarantee</span>
            <span className="text-botanical-border-strong">·</span>
            <span>Since {BUSINESS.established}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
