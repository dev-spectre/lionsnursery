import { BUSINESS } from "@/constants";

export async function GET() {
  const body = `
User-agent: *
Allow: /
Allow: /plants/*
Disallow: /admin/
Disallow: /api/

Sitemap: ${BUSINESS.domain.replace(/\/$/, "")}/sitemap.xml
`.trim();

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
}
