import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { productId, quantity } = createOrderSchema.parse(body)

    // Get product and check availability
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "Sản phẩm không tồn tại" },
        { status: 404 }
      )
    }

    // Check available accounts
    const availableAccounts = await prisma.account.findMany({
      where: {
        productId,
        status: "AVAILABLE",
      },
      take: quantity,
    })

    if (availableAccounts.length < quantity) {
      return NextResponse.json(
        { error: "Không đủ tài khoản" },
        { status: 400 }
      )
    }

    // Get user balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const totalAmount = Number(product.price) * quantity

    if (Number(user.balance) < totalAmount) {
      return NextResponse.json(
        { error: "Số dư không đủ" },
        { status: 400 }
      )
    }

    // Create order with transaction
    const result = await prisma.$transaction(async (tx: any) => {
      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          totalAmount,
          status: "COMPLETED",
        },
      })

      // Create order items and assign accounts
      for (let i = 0; i < quantity; i++) {
        const account = availableAccounts[i]

        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity: 1,
            price: product.price,
            subtotal: product.price,
          },
        })

        // Assign account to order item
        await tx.account.update({
          where: { id: account.id },
          data: {
            status: "SOLD",
            orderItemId: orderItem.id,
            soldAt: new Date(),
          },
        })
      }

      // Update product sold count
      await tx.product.update({
        where: { id: productId },
        data: {
          sold: { increment: quantity },
        },
      })

      // Update user balance
      await tx.user.update({
        where: { id: user.id },
        data: {
          balance: { decrement: totalAmount },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: user.id,
          type: "PURCHASE",
          amount: totalAmount,
          balanceBefore: user.balance,
          balanceAfter: Number(user.balance) - totalAmount,
          status: "COMPLETED",
          note: `Mua ${quantity}x ${product.name}`,
        },
      })

      return order
    })

    return NextResponse.json({
      success: true,
      order: result,
    })
  } catch (error: any) {
    console.error("Order creation error:", error)

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

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
            account: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("Get orders error:", error)
    return NextResponse.json(
      { error: "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
