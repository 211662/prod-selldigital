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

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if slug exists (excluding current product)
    const existing = await prisma.product.findFirst({
      where: {
        slug: data.slug,
        NOT: { id: params.id },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Slug đã tồn tại" },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data,
    })

    return NextResponse.json({ success: true, product })
  } catch (error: any) {
    console.error("Update product error:", error)

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if product has orders
    const ordersCount = await prisma.orderItem.count({
      where: { productId: params.id },
    })

    if (ordersCount > 0) {
      return NextResponse.json(
        { error: "Không thể xóa sản phẩm đã có đơn hàng" },
        { status: 400 }
      )
    }

    // Delete all accounts first
    await prisma.account.deleteMany({
      where: { productId: params.id },
    })

    // Delete product
    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete product error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
