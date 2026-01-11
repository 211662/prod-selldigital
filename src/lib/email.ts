/**
 * Email Service Helper
 * Provides utility functions to send emails throughout the application
 */

type WelcomeEmailData = {
  name: string
}

type OrderConfirmationEmailData = {
  name: string
  orderNumber: string
  productName: string
  quantity: number
  totalAmount: number
  accounts: Array<{
    username: string
    password: string
  }>
}

type DepositConfirmationEmailData = {
  userName: string
  amount: number
  transactionId: string
  date: string
}

type EmailType = "welcome" | "order-confirmation" | "deposit-confirmation"

type EmailData =
  | WelcomeEmailData
  | OrderConfirmationEmailData
  | DepositConfirmationEmailData

interface SendEmailParams {
  to: string
  type: EmailType
  data: EmailData
}

/**
 * Send an email using the internal API
 * @param params - Email parameters including recipient, type, and data
 * @returns Promise with success status and message ID
 */
export async function sendEmail({ to, type, data }: SendEmailParams) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to, type, data }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || "Failed to send email")
    }

    return {
      success: true,
      messageId: result.messageId,
    }
  } catch (error) {
    console.error("Send email error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Send welcome email to new user
 */
export async function sendWelcomeEmail(to: string, name: string) {
  return sendEmail({
    to,
    type: "welcome",
    data: { name },
  })
}

/**
 * Send order confirmation email with account details
 */
export async function sendOrderConfirmationEmail(
  to: string,
  data: OrderConfirmationEmailData
) {
  return sendEmail({
    to,
    type: "order-confirmation",
    data,
  })
}

/**
 * Send deposit confirmation email
 */
export async function sendDepositConfirmationEmail(
  to: string,
  data: DepositConfirmationEmailData
) {
  return sendEmail({
    to,
    type: "deposit-confirmation",
    data,
  })
}
