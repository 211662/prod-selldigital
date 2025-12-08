import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { encrypt } from "@/lib/encryption"
import { z } from "zod"

const uploadSchema = z.object({
  accounts: z.array(z.string().min(1)),
})

export async function POST(
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
    const { accounts } = uploadSchema.parse(body)

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: params.id },
    })

    if (!product) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      )
    }

    // Create accounts
    const createdAccounts = await Promise.all(
      accounts.map((content) =>
        prisma.account.create({
          data: {
            productId: params.id,
            content: encrypt(content),
            status: "AVAILABLE",
          },
        })
      )
    )

    // Update product stock
    await prisma.product.update({
      where: { id: params.id },
      data: {
        stock: { increment: accounts.length },
      },
    })

    return NextResponse.json({
      success: true,
      count: createdAccounts.length,
    })
  } catch (error: any) {
    console.error("Upload accounts error:", error)

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
