import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/product-form"

export default async function CreateProductPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  })

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm sản phẩm mới</h1>
        <p className="text-gray-600">Điền thông tin sản phẩm</p>
      </div>

      <ProductForm categories={categories} />
    </div>
  )
}
