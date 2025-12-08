import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { registerServerSchema } from "@/lib/validations"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    // Validate input
    const validatedData = registerServerSchema.parse(body)
    
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
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10)
    
    // Create user
    const user = await prisma.user.create({
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
    
    return NextResponse.json(
      {
        message: "Đăng ký thành công",
        user,
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
