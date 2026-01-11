import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error fetching tag:", error)
    return NextResponse.json(
      { error: "Failed to fetch tag" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug } = body

    // Check if tag exists
    const existing = await prisma.tag.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    // Check slug uniqueness (excluding current tag)
    const slugExists = await prisma.tag.findFirst({
      where: {
        slug,
        id: { not: params.id },
      },
    })

    if (slugExists) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.update({
      where: { id: params.id },
      data: {
        name,
        slug,
      },
    })

    return NextResponse.json(tag)
  } catch (error) {
    console.error("Error updating tag:", error)
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if tag has posts
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 })
    }

    if (tag._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete tag with posts" },
        { status: 400 }
      )
    }

    // Delete the tag and its relations
    await prisma.tag.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting tag:", error)
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    )
  }
}
