import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// API schema without confirmPassword
const apiRegisterSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  referralCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = apiRegisterSchema.parse(body)
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })
    
    if (existingUser) {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 }
      )
    }

    // Check referral code if provided
    let affiliateId: string | undefined
    if (body.referralCode) {
      const affiliate = await prisma.affiliate.findUnique({
        where: { 
          code: body.referralCode,
          isActive: true,
        },
      })

      if (affiliate) {
        affiliateId = affiliate.id
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    // Create user and referral in a transaction
    const result = await prisma.$transaction(async (tx: any) => {
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      })

      // Create referral record if affiliate exists
      if (affiliateId) {
        await tx.referral.create({
          data: {
            affiliateId,
            userId: user.id,
            commission: 0, // Will be updated on first purchase
            status: "PENDING",
          },
        })
      }

      return user
    })
    
    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user: result,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Register error:", error?.message || error)
    
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { message: "Dữ liệu không hợp lệ", errors: error.errors },
        { status: 400 }
      )
    }

    // Database connection error
    if (error?.code === "P2002") {
      return NextResponse.json(
        { message: "Email đã được sử dụng" },
        { status: 400 }
      )
    }

    // Prisma connection error
    if (error?.code?.startsWith("P")) {
      return NextResponse.json(
        { message: "Không thể kết nối đến database. Vui lòng đảm bảo PostgreSQL đang chạy." },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { message: error?.message || "Có lỗi xảy ra, vui lòng thử lại" },
      { status: 500 }
    )
  }
}
