import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

/** Public, indexable pages only. /admin, /portal, /login and result pages are excluded. */
export const PUBLIC_PATHS = [
  "/",
  "/egg-donor",
  "/sperm-donor",
  "/apply/egg",
  "/apply/sperm",
  "/refer",
  "/faq",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PUBLIC_PATHS.map((p) => ({
    url: siteUrl(p),
    lastModified: now,
    changeFrequency: p === "/" || p.endsWith("-donor") ? "weekly" : "monthly",
    priority: p === "/" ? 1 : p.endsWith("-donor") ? 0.9 : 0.5,
  }));
}
