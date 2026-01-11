import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, bankName, bankAccount, bankHolder, note } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Số tiền không hợp lệ" },
        { status: 400 }
      )
    }

    if (!bankName || !bankAccount || !bankHolder) {
      return NextResponse.json(
        { error: "Thông tin ngân hàng không đầy đủ" },
        { status: 400 }
      )
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

    if (!affiliate.isActive) {
      return NextResponse.json(
        { error: "Tài khoản đại lý đã bị vô hiệu hóa" },
        { status: 400 }
      )
    }

    // Check available balance
    const totalEarned = Number(affiliate.totalEarned)
    const totalWithdrawn = Number(affiliate.totalWithdrawn)
    const availableBalance = totalEarned - totalWithdrawn

    if (amount > availableBalance) {
      return NextResponse.json(
        { error: `Số dư khả dụng chỉ còn ${availableBalance.toLocaleString("vi-VN")} VNĐ` },
        { status: 400 }
      )
    }

    // Minimum withdrawal amount
    if (amount < 100000) {
      return NextResponse.json(
        { error: "Số tiền rút tối thiểu là 100,000 VNĐ" },
        { status: 400 }
      )
    }

    const withdrawal = await prisma.affiliateWithdrawal.create({
      data: {
        affiliateId: affiliate.id,
        amount,
        bankName,
        bankAccount,
        bankHolder,
        note: note || "",
        status: "PENDING",
      },
    })

    return NextResponse.json({
      success: true,
      withdrawal,
    })
  } catch (error: any) {
    console.error("Create withdrawal error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}

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

    const withdrawals = await prisma.affiliateWithdrawal.findMany({
      where: { affiliateId: affiliate.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(
      withdrawals.map((w: any) => ({
        ...w,
        amount: Number(w.amount),
      }))
    )
  } catch (error: any) {
    console.error("Get withdrawals error:", error)
    return NextResponse.json(
      { error: error.message || "Có lỗi xảy ra" },
      { status: 500 }
    )
  }
}
