import { MetadataRoute } from "next"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://selldigital.com"

  // Get all published blog posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  })

  // Get all categories
  const categories = await prisma.postCategory.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      order: "asc",
    },
  })

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  // Blog posts
  const postPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Blog categories
  const categoryPages: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/blog/category/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticPages, ...postPages, ...categoryPages]
}
