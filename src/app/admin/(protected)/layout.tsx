import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/features/admin/components/Sidebar";

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="min-h-screen flex-1 pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </div>
    </div>
  );
}
