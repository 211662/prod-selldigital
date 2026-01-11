import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: params.slug,
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        comments: {
          where: {
            status: "APPROVED",
            parentId: null,
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            replies: {
              where: {
                status: "APPROVED",
              },
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    image: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get related posts (same category, exclude current post)
    const relatedPosts = await prisma.post.findMany({
      where: {
        published: true,
        categoryId: post.categoryId,
        id: {
          not: post.id,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
      take: 4,
      orderBy: {
        publishedAt: "desc",
      },
    })

    return NextResponse.json({
      post,
      relatedPosts,
    })
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Increment view count
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await prisma.post.update({
      where: { slug: params.slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Increment view error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
