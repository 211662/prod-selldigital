import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, parentId } = body

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      )
    }

    // Find the post by slug
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true, published: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    if (!post.published) {
      return NextResponse.json(
        { error: "Cannot comment on unpublished post" },
        { status: 400 }
      )
    }

    // If parentId is provided, verify it exists
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: parentId },
      })

      if (!parentComment || parentComment.postId !== post.id) {
        return NextResponse.json(
          { error: "Invalid parent comment" },
          { status: 400 }
        )
      }
    }

    // Create the comment (status PENDING by default)
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: post.id,
        userId: session.user.id,
        parentId: parentId || null,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      comment,
      message: "Bình luận của bạn đang chờ phê duyệt",
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Find the post by slug
    const post = await prisma.post.findUnique({
      where: { slug: params.slug },
      select: { id: true },
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    // Get only approved comments
    const comments = await prisma.comment.findMany({
      where: {
        postId: post.id,
        status: "APPROVED",
        parentId: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
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
                email: true,
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
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    )
  }
}
