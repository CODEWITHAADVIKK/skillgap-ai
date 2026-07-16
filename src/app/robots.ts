import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/gap-analysis",
        "/roadmap",
        "/skill-trends",
        "/profile",
        "/settings",
        "/applications",
        "/projects",
        "/reports",
        "/interview-prep",
        "/api/",
        "/onboarding",
      ],
    },
    sitemap: "https://skillgap-ai.com/sitemap.xml",
  };
}
