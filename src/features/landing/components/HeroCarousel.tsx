"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide } from "@/generated/prisma";
import { BUSINESS } from "@/constants";
import { cloudinaryBlurDataUrl } from "@/features/shared/lib/cloudinary";
import { buttonVariants } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVAL_MS = 4000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(
    () => setIndex((i) => (i + 1) % slides.length),
    [slides.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(next, INTERVAL_MS);
    return () => clearInterval(t);
  }, [next, slides.length]);

  return (
    <div className="relative h-[min(88vh,720px)] w-full overflow-hidden">
      {slides.map((slide, i) => {
        const blur = cloudinaryBlurDataUrl(slide.imageUrl ?? undefined);
        const show = i === index;
        return (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              show ? "opacity-100" : "opacity-0",
            )}
            aria-hidden={!show}
          >
            {slide.imageUrl ? (
              <Image
                src={slide.imageUrl}
                alt={slide.title ?? BUSINESS.shortName}
                fill
                priority={i === 0}
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
                <p className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
                  {slide.title ?? BUSINESS.name}
                </p>
                <p className="mt-4 max-w-xl text-lg text-white/90 md:text-xl">
                  {slide.subtitle ?? BUSINESS.tagline}
                </p>
                <Link
                  href="/plants"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "mt-8 rounded-full bg-white px-8 text-botanical-primary shadow-none hover:-translate-y-0.5 hover:bg-white/95",
                  )}
                >
                  Explore Plants →
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-center gap-2 md:bottom-10">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={cn(
              "pointer-events-auto h-2.5 w-2.5 rounded-full border border-white/60 transition-transform",
              i === index ? "scale-125 bg-white" : "bg-white/35",
            )}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={prev}
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-2 text-white backdrop-blur-sm transition hover:bg-black/40 md:left-6 md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-white/30 bg-black/25 p-2 text-white backdrop-blur-sm transition hover:bg-black/40 md:right-6 md:flex"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
