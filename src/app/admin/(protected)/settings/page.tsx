import { prisma } from "@/features/shared/lib/prisma";
import { SettingsForm } from "@/features/admin/components/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Site copy, contact details, and SEO. Changes revalidate the landing page.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
