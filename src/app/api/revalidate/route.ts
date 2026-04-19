import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { revalidateSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = revalidateSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }
  for (const path of parsed.data.paths) {
    revalidatePath(path);
  }
  return Response.json({ revalidated: true, paths: parsed.data.paths });
}
