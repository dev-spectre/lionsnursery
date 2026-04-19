import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { plantPatchSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = plantPatchSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { categoryIds, restore, ...fields } = parsed.data;
  const data = Object.fromEntries(
    Object.entries(fields).filter(
      ([key, value]) =>
        value !== undefined && key !== "categoryIds",
    ),
  ) as Record<string, unknown>;
  if (fields.imageUrl === "") data.imageUrl = null;
  if (restore === true) data.deletedAt = null;

  const hasData = Object.keys(data).length > 0;

  const plant = await prisma.$transaction(async (tx) => {
    if (categoryIds) {
      await tx.plantCategory.deleteMany({ where: { plantId: id } });
      await tx.plantCategory.createMany({
        data: categoryIds.map((categoryId) => ({ plantId: id, categoryId })),
      });
    }
    if (!hasData) {
      return tx.plant.findUniqueOrThrow({
        where: { id },
        include: { categories: { include: { category: true } } },
      });
    }
    return tx.plant.update({
      where: { id },
      data,
      include: { categories: { include: { category: true } } },
    });
  });

  return Response.json(plant);
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  await prisma.plant.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
  return new Response(null, { status: 204 });
}
