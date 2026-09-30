import type { MetadataRoute } from "next";
import { BRAND } from "@/config/brand";
import { DOCS } from "@/components/docs/content";
import { CITIZENS } from "@/data/citizens";

const ROUTES = [
  "/",
  "/swarm",
  "/analytics",
  "/city",
  "/city/companies",
  "/city/projects",
  "/city/create",
  "/docs",
  "/privacy",
  "/passport",
  "/passport/register",
  "/proof",
  "/council",
  "/court",
  "/economy",
  "/square",
  "/foundry/media",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [...ROUTES, ...DOCS.map((d) => `/docs/${d.slug}`), ...CITIZENS.map((c) => `/passport/${c.handle}`)];
  return paths.map((p) => ({
    url: `${BRAND.url}${p === "/" ? "" : p}`,
    lastModified: now,
    changeFrequency: p === "/" || p === "/analytics" ? "daily" : "weekly",
    priority: p === "/" ? 1 : p.startsWith("/passport/") ? 0.4 : 0.7,
  }));
}
