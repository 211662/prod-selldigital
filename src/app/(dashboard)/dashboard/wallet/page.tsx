import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, CheckCircle, XCircle, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function WalletPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const [user, transactions] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { balance: true },
    }),
    prisma.transaction.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ])

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      DEPOSIT: "Nạp tiền",
      PURCHASE: "Mua hàng",
      REFUND: "Hoàn tiền",
      ADJUSTMENT: "Điều chỉnh",
    }
    return labels[type] || type
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { icon: any; className: string; label: string }> = {
      PENDING: {
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800",
        label: "Chờ duyệt",
      },
      COMPLETED: {
        icon: CheckCircle,
        className: "bg-green-100 text-green-800",
        label: "Hoàn thành",
      },
      CANCELLED: {
        icon: XCircle,
        className: "bg-red-100 text-red-800",
        label: "Đã hủy",
      },
    }
    return badges[status] || badges.PENDING
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Ví tiền</h1>
        <p className="text-gray-600">Quản lý số dư và giao dịch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Số dư hiện tại</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-blue-600 mb-4">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(Number(user?.balance || 0))}
            </p>
            <Link href="/dashboard/wallet/deposit">
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Nạp tiền
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thông tin nạp tiền</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="text-gray-600">Ngân hàng:</p>
              <p className="font-semibold">VCB - Vietcombank</p>
            </div>
            <div>
              <p className="text-gray-600">Số tài khoản:</p>
              <p className="font-semibold">1234567890</p>
            </div>
            <div>
              <p className="text-gray-600">Chủ tài khoản:</p>
              <p className="font-semibold">NGUYEN VAN A</p>
            </div>
            <div>
              <p className="text-gray-600">Nội dung:</p>
              <p className="font-semibold text-blue-600">
                NAP {session.user.id.substring(0, 8).toUpperCase()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử giao dịch</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có giao dịch nào
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx: any) => {
                const statusInfo = getStatusBadge(tx.status)
                const StatusIcon = statusInfo.icon

                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-medium">{getTypeLabel(tx.type)}</p>
                        <span
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${statusInfo.className}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{formatDate(tx.createdAt)}</p>
                      {tx.note && (
                        <p className="text-sm text-gray-500 mt-1">{tx.note}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-bold ${
                          tx.type === "DEPOSIT" || tx.type === "REFUND"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "DEPOSIT" || tx.type === "REFUND" ? "+" : "-"}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(tx.amount))}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số dư:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(tx.balanceAfter)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
