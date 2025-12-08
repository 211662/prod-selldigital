"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  price: z.string().min(1, "Giá là bắt buộc"),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  categories: any[]
  product?: any
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          description: product.description,
          categoryId: product.categoryId,
          price: product.price.toString(),
          isFeatured: product.isFeatured,
          isActive: product.isActive,
        }
      : {
          isFeatured: false,
          isActive: true,
        },
  })

  const name = watch("name")

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue("name", value)
    if (!product) {
      setValue("slug", generateSlug(value))
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)

    try {
      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products"
      
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra")
      }

      toast({
        title: product ? "Cập nhật thành công" : "Tạo sản phẩm thành công",
        description: `Sản phẩm ${data.name} đã được ${product ? "cập nhật" : "tạo"}`,
      })

      router.push("/admin/products")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="name">Tên sản phẩm *</Label>
            <Input
              id="name"
              {...register("name")}
              onChange={handleNameChange}
              placeholder="VD: Facebook BM Ads"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="facebook-bm-ads"
            />
            {errors.slug && (
              <p className="text-sm text-red-600 mt-1">{errors.slug.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="categoryId">Danh mục *</Label>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Chọn danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-sm text-red-600 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Mô tả *</Label>
            <textarea
              id="description"
              {...register("description")}
              rows={5}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Mô tả chi tiết về sản phẩm..."
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Giá (VNĐ) *</Label>
            <Input
              id="price"
              type="number"
              step="1000"
              {...register("price")}
              placeholder="350000"
            />
            {errors.price && (
              <p className="text-sm text-red-600 mt-1">{errors.price.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isFeatured"
              {...register("isFeatured")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isFeatured" className="font-normal cursor-pointer">
              Sản phẩm nổi bật
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="font-normal cursor-pointer">
              Hiển thị sản phẩm
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Đang xử lý..." : product ? "Cập nhật" : "Tạo sản phẩm"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
