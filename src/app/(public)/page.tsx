import { prisma } from "@/features/shared/lib/prisma";
import { BUSINESS, REVALIDATE } from "@/constants";
import { HeroSection } from "@/features/landing/components/HeroSection";
import { FeaturesStrip } from "@/features/landing/components/FeaturesStrip";
import { AboutSection } from "@/features/landing/components/AboutSection";
import { ContactSection } from "@/features/landing/components/ContactSection";
import { CtaSection } from "@/features/landing/components/CtaSection";

export const revalidate = REVALIDATE.landing;

export default async function HomePage() {
  let settings = null;
  let slides: Awaited<ReturnType<typeof prisma.heroSlide.findMany>> = [];
  try {
    ;[settings, slides] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
      prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
      }),
    ]);
  } catch {
    settings = null;
    slides = [];
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BUSINESS.domain,
    name: BUSINESS.name,
    url: BUSINESS.domain,
    telephone: settings?.phone ?? BUSINESS.phone,
    email: settings?.email ?? BUSINESS.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kurumbapalayam",
      addressLocality: "Coimbatore",
      addressRegion: "Tamil Nadu",
      postalCode: "641107",
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 09:00-18:00",
    image: `${BUSINESS.domain}/images/og-default.jpg`,
    priceRange: "₹₹",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection slides={slides} settings={settings} />
      <FeaturesStrip />
      <AboutSection settings={settings} />
      <ContactSection settings={settings} />
      <CtaSection />
    </>
  );
}
