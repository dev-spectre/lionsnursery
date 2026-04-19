import type { SiteSettings } from "@/generated/prisma";
import { BUSINESS } from "@/constants";
import { ContactForm } from "./ContactForm";
import { MapEmbed } from "./MapEmbed";
import { Mail, MapPin, Phone } from "lucide-react";

export function ContactSection({ settings }: { settings: SiteSettings | null }) {
  const phone = settings?.phone ?? BUSINESS.phone;
  const email = settings?.email ?? BUSINESS.email;
  const address = settings?.address ?? BUSINESS.address;
  const hours = settings?.hours ?? BUSINESS.hours;
  const mapSrc = settings?.mapEmbedUrl ?? BUSINESS.mapEmbedUrl;

  return (
    <section id="contact" className="bg-botanical-surface-2 py-20 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-botanical-text md:text-4xl">
            Visit &amp; Contact
          </h2>
          <p className="mt-3 text-botanical-text-muted">
            We would love to hear from you. Reach out anytime.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-botanical-primary" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
                {phone}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-botanical-primary" />
              <a href={`mailto:${email}`} className="hover:underline">
                {email}
              </a>
            </li>
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-botanical-primary" />
              <span>{address}</span>
            </li>
            <li className="text-botanical-text-muted">{hours}</li>
          </ul>
          <ContactForm />
        </div>
        <div className="min-h-[400px]">
          <MapEmbed src={mapSrc} />
        </div>
      </div>
    </section>
  );
}
