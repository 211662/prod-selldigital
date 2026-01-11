import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PurchaseForm from "@/components/product/purchase-form"

interface ProductDetailPageProps {
  params: {
    slug: string
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      accounts: {
        where: { status: "AVAILABLE" },
        take: 1,
      },
    },
  })

  if (!product || !product.isActive) {
    notFound()
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { balance: true },
  })

  const availableStock = await prisma.account.count({
    where: {
      productId: product.id,
      status: "AVAILABLE",
    },
  })

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <p className="text-gray-600">{product.category.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Mô tả sản phẩm</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Giá</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(Number(product.price))}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-1">Còn lại</p>
                <p className="text-lg font-semibold">{availableStock} tài khoản</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Số dư của bạn</p>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(Number(user?.balance || 0))}
                </p>
              </div>

              <PurchaseForm
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  slug: product.slug,
                }}
                userBalance={Number(user?.balance || 0)}
                availableStock={availableStock}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
