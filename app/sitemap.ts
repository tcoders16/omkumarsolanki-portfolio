import type { MetadataRoute } from "next";

const BASE = "https://omkumarsolanki.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1.0 },
    { path: "/consulting", priority: 0.9 },
    { path: "/engineering", priority: 0.9 },
    { path: "/book", priority: 0.7 },
    { path: "/resume", priority: 0.6 },
  ];

  return routes.map(r => ({
    url: `${BASE}${r.path}`,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
