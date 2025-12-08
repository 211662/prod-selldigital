import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Package } from "lucide-react"
import DeleteProductButton from "@/components/admin/delete-product-button"

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      _count: {
        select: {
          accounts: {
            where: { status: "AVAILABLE" },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý sản phẩm</h1>
          <p className="text-gray-600">Thêm, sửa, xóa sản phẩm</p>
        </div>
        <Link href="/admin/products/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.map((product: any) => (
          <Card key={product.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    {product.isFeatured && (
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                        Nổi bật
                      </span>
                    )}
                    {!product.isActive && (
                      <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                        Ẩn
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{product.category.name}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-600">Giá: </span>
                      <span className="font-semibold text-blue-600">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Còn lại: </span>
                      <span className="font-semibold">{product._count.accounts}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Đã bán: </span>
                      <span className="font-semibold">{product.sold}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/products/${product.id}/accounts`}>
                    <Button variant="outline" size="sm">
                      <Package className="w-4 h-4 mr-1" />
                      Tài khoản
                    </Button>
                  </Link>
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DeleteProductButton productId={product.id} productName={product.name} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {products.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Chưa có sản phẩm nào</p>
              <Link href="/admin/products/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm sản phẩm đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
