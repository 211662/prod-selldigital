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

    const category = await prisma.postCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json(
      { error: "Failed to fetch category" },
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
    const { name, slug, description, order } = body

    // Check if category exists
    const existing = await prisma.postCategory.findUnique({
      where: { id: params.id },
    })

    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check slug uniqueness (excluding current category)
    const slugExists = await prisma.postCategory.findFirst({
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

    const category = await prisma.postCategory.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        order: parseInt(order) || 0,
      },
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json(
      { error: "Failed to update category" },
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

    // Check if category has posts
    const category = await prisma.postCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    if (category._count.posts > 0) {
      return NextResponse.json(
        { error: "Cannot delete category with posts" },
        { status: 400 }
      )
    }

    await prisma.postCategory.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    )
  }
}
