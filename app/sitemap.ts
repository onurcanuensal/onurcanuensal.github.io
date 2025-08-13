import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified },
    { url: `${base}/impressum`, lastModified },
    { url: `${base}/datenschutz`, lastModified },
  ];
}
