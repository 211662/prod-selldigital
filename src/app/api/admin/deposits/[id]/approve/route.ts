import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

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

    const deposit = await prisma.deposit.findUnique({
      where: { id: params.id },
      include: { user: true },
    })

    if (!deposit) {
      return NextResponse.json(
        { error: "Không tìm thấy yêu cầu" },
        { status: 404 }
      )
    }

    if (deposit.status !== "PENDING") {
      return NextResponse.json(
        { error: "Yêu cầu đã được xử lý" },
        { status: 400 }
      )
    }

    // Update deposit and user balance in transaction
    await prisma.$transaction(async (tx: any) => {
      // Update deposit status
      await tx.deposit.update({
        where: { id: params.id },
        data: {
          status: "APPROVED",
          processedAt: new Date(),
          processedBy: session.user.id,
          adminNote: "Đã duyệt",
        },
      })

      // Update user balance
      const updatedUser = await tx.user.update({
        where: { id: deposit.userId },
        data: {
          balance: { increment: deposit.amount },
        },
      })

      // Create transaction record
      await tx.transaction.create({
        data: {
          userId: deposit.userId,
          type: "DEPOSIT",
          amount: deposit.amount,
          balanceBefore: updatedUser.balance - deposit.amount,
          balanceAfter: updatedUser.balance,
          status: "COMPLETED",
          note: `Nạp tiền - ${deposit.note || "Không có ghi chú"}`,
        },
      })
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Approve deposit error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
