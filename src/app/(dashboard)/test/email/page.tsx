"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function EmailTestPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const sendTestEmail = async (type: string) => {
    if (!email) {
      setResult({
        success: false,
        message: "Vui lòng nhập email",
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      let data: any = {}

      switch (type) {
        case "welcome":
          data = {
            name: "Nguyễn Văn A",
          }
          break

        case "order-confirmation":
          data = {
            name: "Nguyễn Văn A",
            orderNumber: "TEST12345",
            productName: "Combo Netflix Premium",
            quantity: 1,
            totalAmount: 65000,
            accounts: [
              {
                username: "test@example.com",
                password: "TestPassword123",
              },
            ],
          }
          break

        case "deposit-confirmation":
          data = {
            userName: "Nguyễn Văn A",
            amount: 100000,
            transactionId: "DEP" + Date.now(),
            date: new Date().toLocaleDateString("vi-VN"),
          }
          break
      }

      const response = await fetch("/api/email/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          type,
          data,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: `Email ${type} đã được gửi thành công! Message ID: ${result.messageId}`,
        })
      } else {
        setResult({
          success: false,
          message: result.error || "Không thể gửi email",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Lỗi không xác định",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Test Email System</h1>
          <p className="text-muted-foreground mt-2">
            Gửi email test để kiểm tra hệ thống email
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Nhập email của bạn để nhận email test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email nhận test</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Welcome Email</CardTitle>
              <CardDescription>Email chào mừng người dùng mới</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => sendTestEmail("welcome")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Đang gửi..." : "Gửi Welcome Email"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Confirmation</CardTitle>
              <CardDescription>
                Email xác nhận đơn hàng với thông tin tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => sendTestEmail("order-confirmation")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Đang gửi..." : "Gửi Order Email"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Deposit Confirmation</CardTitle>
              <CardDescription>Email xác nhận nạp tiền thành công</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => sendTestEmail("deposit-confirmation")}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Đang gửi..." : "Gửi Deposit Email"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-sm">Lưu ý</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              • Đảm bảo bạn đã cấu hình RESEND_API_KEY trong file .env
            </p>
            <p>
              • Với Resend miễn phí, bạn chỉ có thể gửi đến email đã verify
            </p>
            <p>
              • Kiểm tra spam folder nếu không thấy email trong inbox
            </p>
            <p>
              • Email có thể mất vài giây để đến hòm thư
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
