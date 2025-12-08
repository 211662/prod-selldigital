import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import ApproveDepositButton from "@/components/admin/approve-deposit-button"
import RejectDepositButton from "@/components/admin/reject-deposit-button"

export default async function AdminDepositsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const deposits = await prisma.deposit.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
    }
    return badges[status] || badges.PENDING
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu nạp tiền</h1>
        <p className="text-gray-600">Duyệt các yêu cầu nạp tiền</p>
      </div>

      <div className="space-y-4">
        {deposits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Chưa có yêu cầu nạp tiền nào
            </CardContent>
          </Card>
        ) : (
          deposits.map((deposit: any) => (
            <Card key={deposit.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(deposit.amount)}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          deposit.status
                        )}`}
                      >
                        {deposit.status === "PENDING" && "Chờ duyệt"}
                        {deposit.status === "APPROVED" && "Đã duyệt"}
                        {deposit.status === "REJECTED" && "Đã từ chối"}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">Người dùng: </span>
                        <span className="font-medium">{deposit.user.email}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Thời gian: </span>
                        <span>{formatDate(deposit.createdAt)}</span>
                      </p>
                      {deposit.note && (
                        <p>
                          <span className="text-gray-600">Ghi chú: </span>
                          <span>{deposit.note}</span>
                        </p>
                      )}
                      {deposit.proofImage && (
                        <p>
                          <a
                            href={deposit.proofImage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            Xem ảnh chuyển khoản →
                          </a>
                        </p>
                      )}
                      {deposit.adminNote && (
                        <p className="text-gray-500 italic">
                          Admin: {deposit.adminNote}
                        </p>
                      )}
                    </div>
                  </div>

                  {deposit.status === "PENDING" && (
                    <div className="flex gap-2 ml-4">
                      <ApproveDepositButton depositId={deposit.id} />
                      <RejectDepositButton depositId={deposit.id} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
