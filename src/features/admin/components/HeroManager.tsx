"use client";

import { useEffect, useState } from "react";
import type { HeroSlide } from "@/generated/prisma";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ImageUpload } from "@/features/shared/components/ImageUpload";
import { CLOUDINARY } from "@/constants";
import { adminFetch } from "../hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

function SortRow({
  slide,
  onChange,
  onDelete,
}: {
  slide: HeroSlide;
  onChange: (patch: Partial<HeroSlide>) => void;
  onDelete: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm md:flex-row"
    >
      <button
        type="button"
        className="text-botanical-text-muted hover:text-botanical-text"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      <div className="flex-1 space-y-3">
        <ImageUpload
          folder={CLOUDINARY.folders.hero}
          currentUrl={slide.imageUrl}
          onUpload={(url) => onChange({ imageUrl: url })}
          onRemove={() => onChange({ imageUrl: null })}
        />
        <Input
          placeholder="Title"
          value={slide.title ?? ""}
          onChange={(e) => onChange({ title: e.target.value })}
          className="rounded-lg"
        />
        <Input
          placeholder="Subtitle"
          value={slide.subtitle ?? ""}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          className="rounded-lg"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Active</span>
          <Switch
            checked={slide.active}
            onCheckedChange={(active) => onChange({ active })}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            className="rounded-full"
            onClick={async () => {
              const r = await adminFetch(`/api/hero/${slide.id}`, {
                method: "PATCH",
                body: JSON.stringify({
                  title: slide.title,
                  subtitle: slide.subtitle,
                  imageUrl: slide.imageUrl,
                  active: slide.active,
                }),
              });
              if (!r.ok) toast.error("Save failed");
              else {
                toast.success("Slide saved. Landing page updated.");
              }
            }}
          >
            Save slide
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="rounded-full text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="mr-1 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HeroManager() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  async function load() {
    setLoading(true);
    try {
      const r = await adminFetch("/api/hero?admin=1");
      const data = await r.json();
      setSlides(data);
    } catch {
      toast.error("Could not load hero slides.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = slides.findIndex((s) => s.id === active.id);
    const newIndex = slides.findIndex((s) => s.id === over.id);
    const next = arrayMove(slides, oldIndex, newIndex);
    setSlides(next);
    const r = await adminFetch("/api/hero/reorder", {
      method: "PATCH",
      body: JSON.stringify({ ids: next.map((s) => s.id) }),
    });
    if (!r.ok) {
      toast.error("Reorder failed");
      load();
    } else toast.success("Order updated.");
  }

  async function addSlide() {
    const r = await adminFetch("/api/hero", {
      method: "POST",
      body: JSON.stringify({ title: "", subtitle: "", active: true }),
    });
    if (!r.ok) toast.error("Could not add slide");
    else {
      toast.success("Slide added.");
      load();
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-botanical-primary-light/50 p-4 text-sm text-botanical-text">
        If only one active slide is set, the homepage displays it as a static
        background image — no carousel controls are shown.
      </div>
      <Button type="button" className="rounded-full" onClick={addSlide}>
        Add slide
      </Button>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={slides.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {slides.map((s) => (
              <SortRow
                key={s.id}
                slide={s}
                onChange={(patch) =>
                  setSlides((prev) =>
                    prev.map((x) => (x.id === s.id ? { ...x, ...patch } : x)),
                  )
                }
                onDelete={async () => {
                  const r = await adminFetch(`/api/hero/${s.id}`, {
                    method: "DELETE",
                  });
                  if (!r.ok) toast.error("Delete failed");
                  else {
                    toast.success("Slide removed.");
                    load();
                  }
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
