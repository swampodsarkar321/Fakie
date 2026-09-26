import type { MetadataRoute } from "next";
import { GENERATORS } from "@/lib/generators";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://fakie.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = GENERATORS.map((g) => ({ url: `${BASE}/generate/${g.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }));
  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...tools,
  ];
}
