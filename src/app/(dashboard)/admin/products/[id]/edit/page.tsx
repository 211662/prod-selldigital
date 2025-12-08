import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import ProductForm from "@/components/admin/product-form"

interface EditProductPageProps {
  params: {
    id: string
  }
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    }),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa sản phẩm</h1>
        <p className="text-gray-600">Cập nhật thông tin sản phẩm</p>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  )
}
