import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const affiliate = await prisma.affiliate.findUnique({
      where: { userId: session.user.id },
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: "Bạn chưa đăng ký làm đại lý" },
        { status: 404 }
      )
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    const referrals = await prisma.referral.findMany({
      where: {
        affiliateId: affiliate.id,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      referrals.map((r: any) => ({
        id: r.id,
        user: r.user,
        commission: Number(r.commission),
        status: r.status,
        orderId: r.orderId,
        createdAt: r.createdAt,
        paidAt: r.paidAt,
      }))
    )
  } catch (error: any) {
    console.error("Get referrals error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
