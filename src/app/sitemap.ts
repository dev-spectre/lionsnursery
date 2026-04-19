import type { MetadataRoute } from "next";
import { BUSINESS } from "@/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = BUSINESS.domain.replace(/\/$/, "");
  return [
    { url: `${base}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/plants`, priority: 0.9, changeFrequency: "daily" },
  ];
}
