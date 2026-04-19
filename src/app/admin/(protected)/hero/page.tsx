import { HeroManager } from "@/features/admin/components/HeroManager";

export default function AdminHeroPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Hero carousel</h1>
        <p className="text-muted-foreground">
          Drag to reorder. Saving updates the landing page immediately.
        </p>
      </div>
      <HeroManager />
    </div>
  );
}
