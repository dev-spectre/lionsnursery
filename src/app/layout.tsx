import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { prisma } from "@/features/shared/lib/prisma";
import { BUSINESS } from "@/constants";
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
  } catch {
    settings = null;
  }

  const titleBase =
    settings?.metaTitle ?? "Lions Nursery — Quality Plants in Coimbatore";
  const description =
    settings?.metaDescription ??
    "Buy quality indoor and outdoor plants in Coimbatore. Fast delivery, expert care tips. Order from Lions Landscape Nursery.";

  return {
    title: {
      default: titleBase,
      template: "%s | Lions Nursery",
    },
    description,
    metadataBase: new URL(BUSINESS.domain),
    openGraph: {
      siteName: BUSINESS.name,
      type: "website",
      locale: "en_IN",
      images: [settings?.ogImageUrl || "/images/og-default.jpg"],
    },
    twitter: { card: "summary_large_image" },
    robots: { index: true, follow: true },
    alternates: { canonical: BUSINESS.domain },
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(playfair.variable, dmSans.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
