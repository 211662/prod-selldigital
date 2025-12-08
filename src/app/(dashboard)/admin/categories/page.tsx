import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import DeleteCategoryButton from "@/components/admin/delete-category-button"

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { order: "asc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý danh mục</h1>
          <p className="text-gray-600">Quản lý danh mục sản phẩm</p>
        </div>
        <Link href="/admin/categories/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm danh mục
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category: any) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.slug}</p>
                  {category.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-sm">
                  <span className="text-gray-600">Sản phẩm: </span>
                  <span className="font-semibold">{category._count.products}</span>
                </div>
                <div className="flex gap-2">
                  {!category.isActive && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      Ẩn
                    </span>
                  )}
                  <Link href={`/admin/categories/${category.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                  <DeleteCategoryButton
                    categoryId={category.id}
                    categoryName={category.name}
                    productCount={category._count.products}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">Chưa có danh mục nào</p>
              <Link href="/admin/categories/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm danh mục đầu tiên
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
