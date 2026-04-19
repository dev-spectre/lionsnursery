import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const count = await prisma.plantCategory.count({ where: { categoryId: id } });
  if (count > 0) {
    return Response.json(
      { error: "Cannot delete category with assigned plants" },
      { status: 400 },
    );
  }
  await prisma.category.delete({ where: { id } });
  return new Response(null, { status: 204 });
}
