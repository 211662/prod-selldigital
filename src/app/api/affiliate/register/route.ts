import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user already has affiliate account
    const existingAffiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    })

    if (existingAffiliate) {
      return NextResponse.json(
        { error: "Bạn đã có tài khoản đại lý" },
        { status: 400 }
      )
    }

    // Generate unique affiliate code
    const code = await generateUniqueCode()

    const affiliate = await prisma.affiliate.create({
      data: {
        userId: session.user.id,
        code,
        commissionRate: 10, // Default 10%
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      affiliate,
    })
  } catch (error: any) {
    console.error("Register affiliate error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

async function generateUniqueCode(): Promise<string> {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  let isUnique = false

  while (!isUnique) {
    code = ""
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    const existing = await prisma.affiliate.findUnique({
      where: { code },
    })

    if (!existing) {
      isUnique = true
    }
  }

  return code
}
