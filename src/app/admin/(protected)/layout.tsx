import { AdminSidebar } from "@/features/admin/components/Sidebar";

export default function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="min-h-screen flex-1 pl-60">
        <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
      </div>
    </div>
  );
}
