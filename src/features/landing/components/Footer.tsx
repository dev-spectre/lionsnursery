import Link from "next/link";
import type { SiteSettings } from "@/generated/prisma";
import { BUSINESS } from "@/constants";
import { Leaf } from "lucide-react";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const siteName = settings?.siteName ?? BUSINESS.name;
  const tagline = settings?.tagline ?? BUSINESS.tagline;
  const phone = settings?.phone ?? BUSINESS.phone;
  const email = settings?.email ?? BUSINESS.email;
  const address = settings?.address ?? BUSINESS.address;
  const wa = (settings?.whatsapp ?? BUSINESS.whatsapp).replace(/\D/g, "");

  return (
    <footer className="bg-botanical-primary text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
              <Leaf className="h-5 w-5" />
            </span>
            {siteName}
          </div>
          <p className="mt-4 text-sm text-white/85">{tagline}</p>
          <p className="mt-6 text-sm text-white/75">
            Cultivating quality plants in Coimbatore since {BUSINESS.established}.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Quick links</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/plants" className="hover:underline">
                Shop plants
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link href="/#contact" className="hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold">Contact</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            <li>{phone}</li>
            <li>{email}</li>
            <li>{address}</li>
          </ul>
          <Link
            href={`https://wa.me/${wa}`}
            className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-botanical-primary transition hover:-translate-y-0.5"
          >
            Chat on WhatsApp
          </Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-white/70 md:flex-row md:items-center md:justify-between md:px-6">
          <p>© {new Date().getFullYear()} {siteName}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
