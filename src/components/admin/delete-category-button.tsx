"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"

interface DeleteCategoryButtonProps {
  categoryId: string
  categoryName: string
  productCount: number
}

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
  productCount,
}: DeleteCategoryButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (productCount > 0) {
      toast({
        variant: "destructive",
        title: "Không thể xóa",
        description: `Danh mục ${categoryName} còn ${productCount} sản phẩm. Hãy xóa sản phẩm trước.`,
      })
      return
    }

    if (!confirm(`Bạn có chắc muốn xóa danh mục "${categoryName}"?`)) {
      return
    }

    setIsDeleting(true)

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Xóa thất bại")
      }

      toast({
        title: "Xóa thành công",
        description: `Danh mục ${categoryName} đã được xóa`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={isDeleting}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  )
}
