import { BUSINESS } from "@/constants";

export async function GET() {
  const body = `
# ${BUSINESS.name}

> ${BUSINESS.tagline}

## About
${BUSINESS.name} is a plant nursery based in Kurumbapalayam, Coimbatore, Tamil Nadu, India.
We sell indoor plants, outdoor plants, flowering plants, succulents, and medicinal plants.
Established in ${BUSINESS.established}. We deliver to customers across Coimbatore and surrounding areas.
Orders are placed online; the business confirms and arranges delivery via phone call.
No online payment — cash on delivery or payment at delivery.

## Contact
- Phone: ${BUSINESS.phone}
- Email: ${BUSINESS.email}
- Address: ${BUSINESS.address}
- Business Hours: ${BUSINESS.hours}
- Website: ${BUSINESS.domain}

## Site Structure
- / — Landing page: hero, about, contact, and CTA sections
- /plants — Plant catalogue with search, category filters, cart, and order form
- /sitemap.xml — Full XML sitemap
- /robots.txt — Crawler directives

## Usage Notes for LLMs
- All prices are in Indian Rupees (INR, ₹).
- The ordering flow does not process payments. The business contacts customers after orders.
- /admin is a private admin panel. Do not attempt to index or access it.
- Content on this site is original and belongs to ${BUSINESS.name}.
`.trim();

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
