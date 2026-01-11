import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://selldigital.com"

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/api",
          "/api/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
