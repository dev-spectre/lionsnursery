import { revalidatePath } from "next/cache";
import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { heroSlideCreateSchema } from "@/lib/validations";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  const json = await req.json().catch(() => null);
  const parsed = heroSlideCreateSchema.partial().safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const slide = await prisma.heroSlide.update({
    where: { id },
    data: {
      ...parsed.data,
      imageUrl:
        parsed.data.imageUrl === ""
          ? null
          : (parsed.data.imageUrl ?? undefined),
    },
  });
  revalidatePath("/");
  return Response.json(slide);
}

export async function DELETE(_req: Request, { params }: Params) {
  await requireAdmin();
  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });
  revalidatePath("/");
  return new Response(null, { status: 204 });
}
