import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminLoginClient } from "./AdminLoginClient";

export default async function AdminLoginPage() {
  const session = await auth();
  if (session) {
    redirect("/admin/dashboard");
  }
  return <AdminLoginClient />;
}
