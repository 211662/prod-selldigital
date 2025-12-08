import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  categoryId: z.string().min(1),
  price: z.number().positive(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const data = productSchema.parse(body)

    // Check if slug exists
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      )
    }

    const product = await prisma.product.create({
      data: {
        ...data,
        stock: 0,
        sold: 0,
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error("Create product error:", error)

    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dữ liệu không hợp lệ", details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
