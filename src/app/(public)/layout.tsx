import { prisma } from "@/features/shared/lib/prisma";
import { Header } from "@/features/shared/components/Header";
import { Footer } from "@/features/landing/components/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings = null;
  try {
    settings = await prisma.siteSettings.findUnique({
      where: { id: "singleton" },
    });
  } catch {
    settings = null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header settings={settings} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
