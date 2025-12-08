import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CategoryForm from "@/components/admin/category-form"

interface EditCategoryPageProps {
  params: {
    id: string
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { id: params.id },
  })

  if (!category) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Chỉnh sửa danh mục</h1>
        <p className="text-gray-600">Cập nhật thông tin danh mục</p>
      </div>

      <CategoryForm category={category} />
    </div>
  )
}
