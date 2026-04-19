import Image from "next/image";
import Link from "next/link";
import type { HeroSlide, SiteSettings } from "@/generated/prisma";
import { BUSINESS } from "@/constants";
import { cloudinaryBlurDataUrl } from "@/features/shared/lib/cloudinary";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HeroCarousel } from "./HeroCarousel";

export function HeroSection({
  slides,
  settings,
}: {
  slides: HeroSlide[];
  settings: SiteSettings | null;
}) {
  const activeSlides = slides.filter((s) => s.active);
  const tagline = settings?.tagline ?? BUSINESS.tagline;

  if (activeSlides.length === 0) {
    return (
      <section className="relative flex min-h-[min(88vh,640px)] items-center justify-center bg-gradient-to-br from-botanical-primary via-botanical-accent to-botanical-primary-hover px-4">
        <div className="mx-auto max-w-3xl text-center text-white">
          <h1 className="font-display text-4xl font-bold md:text-5xl lg:text-6xl">
            {settings?.siteName ?? BUSINESS.name}
          </h1>
          <p className="mt-6 text-lg text-white/90 md:text-xl">{tagline}</p>
          <Link
            href="/plants"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-10 rounded-full bg-white px-8 text-botanical-primary shadow-none hover:-translate-y-0.5",
            )}
          >
            Explore Plants →
          </Link>
        </div>
      </section>
    );
  }

  if (activeSlides.length === 1) {
    const slide = activeSlides[0]!;
    const blur = cloudinaryBlurDataUrl(slide.imageUrl ?? undefined);
    return (
      <section className="relative h-[min(88vh,720px)] w-full overflow-hidden">
        {slide.imageUrl ? (
          <Image
            src={slide.imageUrl}
            alt={slide.title ?? BUSINESS.shortName}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            placeholder={blur ? "blur" : undefined}
            blurDataURL={blur}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-botanical-primary via-botanical-accent to-botanical-primary-hover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 to-black/55" />
        <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {slide.title ?? BUSINESS.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90 md:text-xl">
              {slide.subtitle ?? tagline}
            </p>
            <Link
              href="/plants"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-8 rounded-full bg-white px-8 text-botanical-primary shadow-none hover:-translate-y-0.5",
              )}
            >
              Explore Plants →
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <HeroCarousel slides={activeSlides} />;
}
