import { prisma } from "@/lib/prisma"
import CategoryForm from "@/components/admin/category-form"

export default async function CreateCategoryPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Thêm danh mục mới</h1>
        <p className="text-gray-600">Tạo danh mục sản phẩm mới</p>
      </div>

      <CategoryForm />
    </div>
  )
}
