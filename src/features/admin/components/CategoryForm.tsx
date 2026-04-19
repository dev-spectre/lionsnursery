"use client";

import { useState } from "react";
import { adminFetch } from "../hooks/useAdminData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function CategoryForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function add() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const r = await adminFetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!r.ok) throw new Error();
      toast.success("Category added.");
      setName("");
      onCreated();
    } catch {
      toast.error("Could not add category.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="text-sm font-medium">New category</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Ferns"
          className="mt-1 rounded-lg"
        />
      </div>
      <Button
        type="button"
        className="rounded-full"
        disabled={loading}
        onClick={add}
      >
        Add
      </Button>
    </div>
  );
}
