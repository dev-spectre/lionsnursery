"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/generated/prisma";
import { adminFetch } from "../hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function SettingsForm({ initial }: { initial: SiteSettings | null }) {
  const [data, setData] = useState<Partial<SiteSettings>>(initial ?? {});

  useEffect(() => {
    setData(initial ?? {});
  }, [initial]);

  async function save() {
    try {
      const r = await adminFetch("/api/settings", {
        method: "PATCH",
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error();
      toast.success("Settings saved. Landing page updated.");
    } catch {
      toast.error("Could not save settings.");
    }
  }

  const field = (key: keyof SiteSettings) => ({
    value: (data[key] as string) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setData((d) => ({ ...d, [key]: e.target.value })),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">General</h2>
        <div>
          <label className="text-sm font-medium">Site name</label>
          <Input className="mt-1 rounded-lg" {...field("siteName")} />
        </div>
        <div>
          <label className="text-sm font-medium">Tagline</label>
          <Input className="mt-1 rounded-lg" {...field("tagline")} />
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">About</h2>
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input className="mt-1 rounded-lg" {...field("aboutTitle")} />
        </div>
        <div>
          <label className="text-sm font-medium">Body</label>
          <Textarea
            className="mt-1 rounded-lg"
            rows={6}
            value={(data.aboutBody as string) ?? ""}
            onChange={(e) =>
              setData((d) => ({ ...d, aboutBody: e.target.value }))
            }
          />
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">Contact</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Phone</label>
            <Input className="mt-1 rounded-lg" {...field("phone")} />
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp</label>
            <Input className="mt-1 rounded-lg" {...field("whatsapp")} />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input className="mt-1 rounded-lg" {...field("email")} />
          </div>
          <div>
            <label className="text-sm font-medium">Hours</label>
            <Input className="mt-1 rounded-lg" {...field("hours")} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Address</label>
          <Textarea
            className="mt-1 rounded-lg"
            rows={2}
            value={(data.address as string) ?? ""}
            onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Map embed URL</label>
          <Input className="mt-1 rounded-lg" {...field("mapEmbedUrl")} />
        </div>
        <div>
          <label className="text-sm font-medium">Footer text</label>
          <Input className="mt-1 rounded-lg" {...field("footerText")} />
        </div>
      </section>
      <Separator />
      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold">SEO</h2>
        <div>
          <label className="text-sm font-medium">Meta title</label>
          <Input className="mt-1 rounded-lg" {...field("metaTitle")} />
        </div>
        <div>
          <label className="text-sm font-medium">Meta description</label>
          <Textarea
            className="mt-1 rounded-lg"
            rows={3}
            value={(data.metaDescription as string) ?? ""}
            onChange={(e) =>
              setData((d) => ({ ...d, metaDescription: e.target.value }))
            }
          />
        </div>
        <div>
          <label className="text-sm font-medium">OG image URL</label>
          <Input className="mt-1 rounded-lg" {...field("ogImageUrl")} />
        </div>
      </section>
      <Button type="button" className="rounded-full" onClick={save}>
        Save settings
      </Button>
    </div>
  );
}
