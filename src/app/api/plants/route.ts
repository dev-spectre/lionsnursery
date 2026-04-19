import { auth } from "@/lib/auth";
import { prisma } from "@/features/shared/lib/prisma";
import { cloudinaryDeliveryUrl } from "@/features/shared/lib/cloudinary";
import { requireAdmin } from "@/lib/server-utils";
import { plantCreateSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const includeDeleted = searchParams.get("includeDeleted") === "true";
  const stock = searchParams.get("stock");
  const session = await auth();

  const where: { deletedAt?: null; inStock?: boolean } = {};
  if (!session || !includeDeleted) {
    where.deletedAt = null;
  }
  if (session && (stock === "in" || stock === "out")) {
    where.inStock = stock === "in";
  }

  const plants = await prisma.plant.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      categories: { include: { category: true } },
    },
  });

  const mapped = plants.map((p) => ({
    ...p,
    imageUrl: cloudinaryDeliveryUrl(p.imageUrl) ?? p.imageUrl,
  }));

  return Response.json(mapped);
}

export async function POST(req: Request) {
  await requireAdmin();
  const json = await req.json().catch(() => null);
  const parsed = plantCreateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { categoryIds, ...rest } = parsed.data;
  const base = rest.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  let slug = base;
  let n = 0;
  while (await prisma.plant.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${base}-${n}`;
  }
  const imageUrl =
    rest.imageUrl === "" ? null : (rest.imageUrl ?? null);
  const plant = await prisma.plant.create({
    data: {
      name: rest.name,
      slug,
      description: rest.description ?? null,
      price: rest.price,
      imageUrl,
      inStock: rest.inStock ?? true,
      categories: {
        create: categoryIds.map((categoryId) => ({ categoryId })),
      },
    },
    include: { categories: { include: { category: true } } },
  });
  return Response.json(plant, { status: 201 });
}
