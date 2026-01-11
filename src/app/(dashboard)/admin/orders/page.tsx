import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

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

  const stats = {
    total: orders.length,
    pending: orders.filter((o: any) => o.status === "PENDING").length,
    completed: orders.filter((o: any) => o.status === "COMPLETED").length,
    revenue: orders
      .filter((o: any) => o.status === "COMPLETED")
      .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý đơn hàng</h1>
        <p className="text-gray-600">Tất cả đơn hàng trong hệ thống</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Chờ xử lý</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Doanh thu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(stats.revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          #{order.orderNumber}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
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
                      <div className="text-sm space-y-1">
                        <p>
                          <span className="text-gray-600">Khách hàng: </span>
                          <span className="font-medium">
                            {order.user.email} {order.user.name && `(${order.user.name})`}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-600">Thời gian: </span>
                          <span>{formatDate(order.createdAt)}</span>
                        </p>
                        <div className="mt-2 pt-2 border-t">
                          {order.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between text-sm mb-1">
                              <span>
                                {item.product.name} x{item.quantity}
                              </span>
                              <span className="font-medium">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.subtotal)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-2xl font-bold text-blue-600 mb-3">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(Number(order.totalAmount))}
                      </p>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
