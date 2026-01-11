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
      include: {
        referrals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!affiliate) {
      return NextResponse.json(
        { error: "Bạn chưa đăng ký làm đại lý" },
        { status: 404 }
      )
    }

    // Calculate available balance (earned - withdrawn)
    const totalEarned = Number(affiliate.totalEarned)
    const totalWithdrawn = Number(affiliate.totalWithdrawn)
    const availableBalance = totalEarned - totalWithdrawn

    // Count statistics
    const totalReferrals = affiliate.referrals.length
    const activeReferrals = affiliate.referrals.filter(
      (r) => r.status === "APPROVED" || r.status === "PAID"
    ).length
    const pendingCommissions = affiliate.referrals
      .filter((r) => r.status === "PENDING")
      .reduce((sum, r) => sum + Number(r.commission), 0)

    return NextResponse.json({
      affiliate: {
        id: affiliate.id,
        code: affiliate.code,
        commissionRate: Number(affiliate.commissionRate),
        totalEarned,
        totalWithdrawn,
        availableBalance,
        isActive: affiliate.isActive,
        createdAt: affiliate.createdAt,
      },
      stats: {
        totalReferrals,
        activeReferrals,
        pendingCommissions,
      },
      referrals: affiliate.referrals.map((r) => ({
        id: r.id,
        user: r.user,
        commission: Number(r.commission),
        status: r.status,
        orderId: r.orderId,
        createdAt: r.createdAt,
        paidAt: r.paidAt,
      })),
    })
  } catch (error: any) {
    console.error("Get affiliate stats error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
