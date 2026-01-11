import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "12")
    const categorySlug = searchParams.get("category")
    const tagSlug = searchParams.get("tag")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured") === "true"

    const skip = (page - 1) * limit

    const where: any = {
      published: true,
      publishedAt: {
        lte: new Date(),
      },
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    if (tagSlug) {
      where.tags = {
        some: {
          tag: {
            slug: tagSlug,
          },
        },
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ]
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: {
                where: {
                  status: "APPROVED",
                },
              },
            },
          },
        },
        orderBy: featured
          ? { viewCount: "desc" }
          : { publishedAt: "desc" },
        skip: featured ? 0 : skip,
        take: featured ? 1 : limit,
      }),
      featured ? 1 : prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
