import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const depositSchema = z.object({
  amount: z.number().positive().min(10000, "Số tiền tối thiểu 10,000đ"),
  note: z.string().optional(),
  proofImage: z.string().optional(),
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
    const data = depositSchema.parse(body)

    // Get current balance
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Create deposit request
    const deposit = await prisma.deposit.create({
      data: {
        userId: session.user.id,
        amount: data.amount,
        status: "PENDING",
        note: data.note || "",
        proofImage: data.proofImage || "",
      },
    })

    return NextResponse.json({
      success: true,
      deposit,
    })
  } catch (error: any) {
    console.error("Deposit request error:", error)

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
