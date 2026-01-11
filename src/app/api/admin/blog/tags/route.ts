import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    })

    return NextResponse.json(tags)
  } catch (error) {
    console.error("Get tags error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug } = body

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const finalSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

    const existingTag = await prisma.tag.findUnique({
      where: { slug: finalSlug },
    })

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 400 }
      )
    }

    const tag = await prisma.tag.create({
      data: {
        name,
        slug: finalSlug,
      },
    })

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error("Create tag error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
