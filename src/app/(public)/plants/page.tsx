import type { Metadata } from "next";
import { PlantsPageClient } from "@/features/plants/components/PlantsPageClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Buy Plants Online",
  description:
    "Browse indoor, outdoor, and flowering plants from Lions Landscape Nursery. Search, filter, and place your order — we will call you to confirm.",
};

export default function PlantsPage() {
  return <PlantsPageClient />;
}
