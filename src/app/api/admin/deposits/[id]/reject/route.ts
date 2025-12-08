import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const rejectSchema = z.object({
  reason: z.string().optional(),
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
    const { reason } = rejectSchema.parse(body)

    const deposit = await prisma.deposit.findUnique({
      where: { id: params.id },
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

    // Update deposit status
    await prisma.deposit.update({
      where: { id: params.id },
      data: {
        status: "REJECTED",
        processedAt: new Date(),
        processedBy: session.user.id,
        adminNote: reason || "Đã từ chối",
      },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Reject deposit error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
