import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { decrypt } from "@/lib/encryption"

interface AdminOrderDetailPageProps {
  params: {
    id: string
  }
}

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      items: {
        include: {
          product: true,
          account: true,
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      PROCESSING: "bg-blue-100 text-blue-800",
      COMPLETED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      REFUNDED: "bg-gray-100 text-gray-800",
    }
    return badges[status] || badges.PENDING
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chi tiết đơn hàng
        </h1>
        <p className="text-gray-600">#{order.orderNumber}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Email: </span>
              <span className="font-medium">{order.user.email}</span>
            </div>
            {order.user.name && (
              <div>
                <span className="text-gray-600">Tên: </span>
                <span className="font-medium">{order.user.name}</span>
              </div>
            )}
            <div>
              <span className="text-gray-600">Số dư: </span>
              <span className="font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.user.balance)}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Role: </span>
              <span className="font-medium">{order.user.role}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Thông tin đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-gray-600">Ngày đặt: </span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-600">Trạng thái: </span>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                  order.status
                )}`}
              >
                {order.status === "COMPLETED" && "Hoàn thành"}
                {order.status === "PENDING" && "Chờ xử lý"}
                {order.status === "PROCESSING" && "Đang xử lý"}
                {order.status === "CANCELLED" && "Đã hủy"}
                {order.status === "REFUNDED" && "Đã hoàn tiền"}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Tổng tiền: </span>
              <span className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(order.totalAmount)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm trong đơn hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      Số lượng: {item.quantity} x{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.subtotal)}
                  </p>
                </div>

                {item.account && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Tài khoản đã giao:
                    </p>
                    <pre className="text-sm whitespace-pre-wrap font-mono bg-white p-3 rounded border">
                      {decrypt(item.account.content)}
                    </pre>
                    <p className="text-xs text-gray-500 mt-2">
                      Ngày giao: {item.account.soldAt ? formatDate(item.account.soldAt) : "N/A"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
