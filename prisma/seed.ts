import { config } from "dotenv";
import { resolve } from "node:path";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma";
import ws from "ws";
import { BUSINESS } from "../src/constants/index";

config({ path: resolve(process.cwd(), ".env") });
config({ path: resolve(process.cwd(), ".env.local"), override: true });

if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

const connectionString = process.env.DATABASE_URL?.replace(/^"|"$/g, "");
if (!connectionString) {
  console.error("DATABASE_URL is not set. Add it to .env or .env.local, then run: npm run db:seed");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString }),
});

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      siteName: BUSINESS.name,
      tagline: BUSINESS.tagline,
      aboutTitle: "Growing Green, Growing Together",
      aboutBody: `Lions Landscape Nursery has been cultivating quality plants and spreading the joy of gardening across Coimbatore since ${BUSINESS.established}. Nestled in the green heart of Kurumbapalayam, we carefully hand-pick every plant to ensure it arrives at your home healthy, vibrant, and ready to thrive.`,
      phone: BUSINESS.phone,
      whatsapp: BUSINESS.whatsapp,
      email: BUSINESS.email,
      address: BUSINESS.address,
      mapEmbedUrl: BUSINESS.mapEmbedUrl,
      hours: BUSINESS.hours,
      footerText: `${BUSINESS.shortName} — Quality plants in Coimbatore.`,
      metaTitle: "Lions Nursery — Quality Plants in Coimbatore",
      metaDescription:
        "Buy quality indoor and outdoor plants in Coimbatore. Fast delivery, expert care tips. Order from Lions Landscape Nursery.",
    },
    update: {
      mapEmbedUrl: BUSINESS.mapEmbedUrl,
      address: BUSINESS.address,
    },
  });

  const categoryDefs = [
    { name: "Indoor Plants", slug: "indoor-plants" },
    { name: "Outdoor Plants", slug: "outdoor-plants" },
    { name: "Flowering Plants", slug: "flowering-plants" },
    { name: "Succulents & Cacti", slug: "succulents-cacti" },
    { name: "Medicinal Plants", slug: "medicinal-plants" },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryDefs) {
    const row = await prisma.category.upsert({
      where: { slug: c.slug },
      create: { name: c.name, slug: c.slug },
      update: {},
    });
    categories[c.slug] = row.id;
  }

  const plantDefs: {
    name: string;
    price: number;
    categorySlugs: string[];
  }[] = [
    { name: "Pothos (Money Plant)", price: 299, categorySlugs: ["indoor-plants"] },
    { name: "Snake Plant", price: 399, categorySlugs: ["indoor-plants"] },
    {
      name: "Peace Lily",
      price: 449,
      categorySlugs: ["indoor-plants", "flowering-plants"],
    },
    { name: "Monstera Deliciosa", price: 799, categorySlugs: ["indoor-plants"] },
    { name: "Jade Plant", price: 349, categorySlugs: ["succulents-cacti"] },
    {
      name: "Aloe Vera",
      price: 249,
      categorySlugs: ["medicinal-plants", "succulents-cacti"],
    },
    {
      name: "Hibiscus",
      price: 399,
      categorySlugs: ["outdoor-plants", "flowering-plants"],
    },
    {
      name: "Bougainvillea",
      price: 499,
      categorySlugs: ["outdoor-plants", "flowering-plants"],
    },
    {
      name: "Tulsi (Holy Basil)",
      price: 149,
      categorySlugs: ["medicinal-plants", "outdoor-plants"],
    },
    { name: "Rubber Plant", price: 599, categorySlugs: ["indoor-plants"] },
  ];

  for (const p of plantDefs) {
    const slug = slugify(p.name);
    const plant = await prisma.plant.upsert({
      where: { slug },
      create: {
        name: p.name,
        slug,
        description: null,
        price: p.price,
        imageUrl: null,
        inStock: true,
        deletedAt: null,
      },
      update: {
        name: p.name,
        price: p.price,
        inStock: true,
        deletedAt: null,
      },
    });

    await prisma.plantCategory.deleteMany({ where: { plantId: plant.id } });
    for (const cs of p.categorySlugs) {
      await prisma.plantCategory.create({
        data: {
          plantId: plant.id,
          categoryId: categories[cs]!,
        },
      });
    }
  }

  await prisma.coupon.upsert({
    where: { code: "SAVE10" },
    create: {
      code: "SAVE10",
      discount: 10,
      maxUses: null,
      usedCount: 0,
      active: true,
    },
    update: {},
  });
  await prisma.coupon.upsert({
    where: { code: "SAVE20" },
    create: {
      code: "SAVE20",
      discount: 20,
      maxUses: null,
      usedCount: 0,
      active: true,
    },
    update: {},
  });
  await prisma.coupon.upsert({
    where: { code: "WELCOME" },
    create: {
      code: "WELCOME",
      discount: 15,
      maxUses: 100,
      usedCount: 0,
      active: true,
    },
    update: {},
  });

  const existingSlides = await prisma.heroSlide.count();
  if (existingSlides === 0) {
    await prisma.heroSlide.create({
      data: {
        imageUrl: null,
        title: BUSINESS.name,
        subtitle: BUSINESS.tagline,
        order: 0,
        active: true,
      },
    });
  }

  console.log("Seed completed: site settings, categories, plants, coupons, hero slide (if empty).");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
