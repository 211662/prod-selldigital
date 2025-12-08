import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DepositForm from "@/components/wallet/deposit-form"

export default async function DepositPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nạp tiền</h1>
        <p className="text-gray-600">Gửi yêu cầu nạp tiền vào ví</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin chuyển khoản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Ngân hàng:</p>
                <p className="font-semibold text-lg">VCB - Vietcombank</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số tài khoản:</p>
                <p className="font-semibold text-lg">1234567890</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chủ tài khoản:</p>
                <p className="font-semibold text-lg">NGUYEN VAN A</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Nội dung chuyển khoản:</p>
                <p className="font-bold text-xl text-blue-600">
                  NAP {session.user.id.substring(0, 8).toUpperCase()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  * Vui lòng nhập chính xác nội dung để được duyệt tự động
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm font-medium text-yellow-800">Lưu ý:</p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
              <li>Chuyển khoản đúng nội dung để được duyệt tự động</li>
              <li>Sau khi chuyển khoản, gửi yêu cầu bên dưới</li>
              <li>Thời gian xử lý: 5-30 phút</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gửi yêu cầu nạp tiền</CardTitle>
        </CardHeader>
        <CardContent>
          <DepositForm userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  )
}
