import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/portal", "/api/", "/auth/", "/login", "/apply/result"],
      },
    ],
    sitemap: siteUrl("/sitemap.xml"),
  };
}
