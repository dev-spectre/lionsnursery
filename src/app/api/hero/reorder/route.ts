import { revalidatePath } from "next/cache";
import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { heroReorderSchema } from "@/lib/validations";

export async function PATCH(req: Request) {
  await requireAdmin();
  const json = await req.json().catch(() => null);
  const parsed = heroReorderSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const { ids } = parsed.data;
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.heroSlide.update({
        where: { id },
        data: { order: index },
      }),
    ),
  );
  revalidatePath("/");
  return Response.json({ ok: true });
}
