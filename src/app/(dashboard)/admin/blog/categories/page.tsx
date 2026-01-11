"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  _count: {
    posts: number
  }
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [order, setOrder] = useState(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/blog/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Error fetching categories:", error)
      alert("Không thể tải danh sách danh mục")
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!editingCategory) {
      setSlug(generateSlug(value))
    }
  }

  const openCreateDialog = () => {
    setEditingCategory(null)
    setName("")
    setSlug("")
    setDescription("")
    setOrder(categories.length)
    setDialogOpen(true)
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description || "")
    setOrder(category.order)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !slug) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    setSaving(true)

    try {
      const url = editingCategory
        ? `/api/admin/blog/categories/${editingCategory.id}`
        : "/api/admin/blog/categories"
      
      const method = editingCategory ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          order,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save category")
      }

      alert(editingCategory ? "Đã cập nhật danh mục" : "Đã tạo danh mục mới")
      setDialogOpen(false)
      fetchCategories()
    } catch (error: any) {
      console.error("Error saving category:", error)
      alert(error.message || "Có lỗi xảy ra")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/categories/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete category")
      }

      alert("Đã xóa danh mục")
      fetchCategories()
    } catch (error: any) {
      console.error("Error deleting category:", error)
      alert(error.message || "Có lỗi xảy ra")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Danh mục Blog</h1>
          <p className="text-muted-foreground">
            Quản lý danh mục bài viết
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Chỉnh sửa danh mục" : "Tạo danh mục mới"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Cập nhật thông tin danh mục"
                  : "Thêm danh mục mới cho blog"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Tên danh mục *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Hướng dẫn"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="huong-dan"
                />
              </div>
              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả ngắn về danh mục"
                />
              </div>
              <div>
                <Label htmlFor="order">Thứ tự hiển thị</Label>
                <Input
                  id="order"
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {editingCategory ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Tổng cộng {categories.length} danh mục
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có danh mục nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead className="text-center">Thứ tự</TableHead>
                  <TableHead className="text-center">Số bài viết</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      /{category.slug}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description || "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{category.order}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge>{category._count.posts}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category.id)}
                          disabled={category._count.posts > 0}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
