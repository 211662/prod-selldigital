import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import WelcomeEmail from "@/emails/welcome"
import OrderConfirmationEmail from "@/emails/order-confirmation"
import DepositConfirmationEmail from "@/emails/deposit-confirmation"

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, to, data } = body

    if (!to || !type) {
      return NextResponse.json(
        { error: "Missing required fields: to, type" },
        { status: 400 }
      )
    }

    let emailTemplate
    let subject = ""

    switch (type) {
      case "welcome":
        emailTemplate = WelcomeEmail({ name: data.name })
        subject = "Chào mừng đến với SellDigital! 🎉"
        break

      case "order-confirmation":
        emailTemplate = OrderConfirmationEmail({
          name: data.name,
          orderNumber: data.orderNumber,
          productName: data.productName,
          quantity: data.quantity,
          totalAmount: data.totalAmount,
          accounts: data.accounts,
        })
        subject = `Đơn hàng #${data.orderNumber} - Thông tin tài khoản của bạn`
        break

      case "deposit-confirmation":
        emailTemplate = DepositConfirmationEmail({
          userName: data.userName,
          amount: data.amount,
          transactionId: data.transactionId,
          date: data.date,
        })
        subject = "Nạp tiền thành công - SellDigital 💰"
        break

      default:
        return NextResponse.json(
          { error: "Invalid email type" },
          { status: 400 }
        )
    }

    // Check if Resend is configured
    if (!resend) {
      console.warn("Resend API key not configured. Email not sent.")
      return NextResponse.json({ 
        success: true, 
        message: "Email would be sent (Resend not configured)" 
      })
    }

    const { data: emailData, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || "SellDigital <onboarding@resend.dev>",
      to: [to],
      subject,
      react: emailTemplate,
    })

    if (error) {
      console.error("Resend error:", error)
      return NextResponse.json(
        { error: "Failed to send email", details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messageId: emailData?.id,
    })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
