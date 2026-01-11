import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function ProductsPage() {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { category: true },
      orderBy: { isFeatured: 'desc' },
    }),
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm</h1>
          <p className="text-gray-600">Tài khoản quảng cáo chất lượng cao</p>
        </div>

        {/* Categories */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <Link href="/dashboard/products">
            <Button variant="outline" size="sm">
              Tất cả
            </Button>
          </Link>
          {categories.map((cat: any) => (
            <Link key={cat.id} href={`/dashboard/products?category=${cat.slug}`}>
              <Button variant="outline" size="sm">
                {cat.name}
              </Button>
            </Link>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {product.isFeatured && (
                  <div className="mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                      Nổi bật
                    </span>
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.category.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                      }).format(Number(product.price))}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Còn: {product.stock}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/products/${product.slug}`} className="w-full">
                  <Button className="w-full">
                    Xem chi tiết
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Chưa có sản phẩm nào
          </div>
        )}
      </div>
    </div>
  )
}
