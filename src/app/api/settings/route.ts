import { revalidatePath } from "next/cache";
import { prisma } from "@/features/shared/lib/prisma";
import { requireAdmin } from "@/lib/server-utils";
import { settingsPatchSchema } from "@/lib/validations";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });
  return Response.json(settings);
}

export async function PATCH(req: Request) {
  await requireAdmin();
  const json = await req.json().catch(() => null);
  const parsed = settingsPatchSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      ...parsed.data,
    },
    update: parsed.data,
  });
  revalidatePath("/");
  return Response.json(settings);
}
