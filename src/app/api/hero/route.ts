import { revalidatePath } from "next/cache";
import { prisma } from "@/features/shared/lib/prisma";
import { cloudinaryDeliveryUrl } from "@/features/shared/lib/cloudinary";
import { requireAdmin } from "@/lib/server-utils";
import { heroSlideCreateSchema } from "@/lib/validations";
import type { HeroSlide } from "@/generated/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("admin") === "1") {
    await requireAdmin();
    const slides = await prisma.heroSlide.findMany({
      orderBy: { order: "asc" },
    });
    return Response.json(
      slides.map((s: HeroSlide) => ({
        ...s,
        imageUrl: cloudinaryDeliveryUrl(s.imageUrl) ?? s.imageUrl,
      })),
    );
  }

  const slides = await prisma.heroSlide.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return Response.json(
    slides.map((s: HeroSlide) => ({
      ...s,
      imageUrl: cloudinaryDeliveryUrl(s.imageUrl) ?? s.imageUrl,
    })),
  );
}

export async function POST(req: Request) {
  await requireAdmin();
  const json = await req.json().catch(() => null);
  const parsed = heroSlideCreateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const maxOrder = await prisma.heroSlide.aggregate({ _max: { order: true } });
  const slide = await prisma.heroSlide.create({
    data: {
      imageUrl: parsed.data.imageUrl || null,
      title: parsed.data.title ?? null,
      subtitle: parsed.data.subtitle ?? null,
      active: parsed.data.active ?? true,
      order: parsed.data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });
  revalidatePath("/");
  return Response.json(slide, { status: 201 });
}
