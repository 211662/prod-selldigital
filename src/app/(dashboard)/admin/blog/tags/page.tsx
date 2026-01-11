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

interface Tag {
  id: string
  name: string
  slug: string
  _count: {
    posts: number
  }
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [saving, setSaving] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/blog/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Error fetching tags:", error)
      alert("Không thể tải danh sách tags")
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
    if (!editingTag) {
      setSlug(generateSlug(value))
    }
  }

  const openCreateDialog = () => {
    setEditingTag(null)
    setName("")
    setSlug("")
    setDialogOpen(true)
  }

  const openEditDialog = (tag: Tag) => {
    setEditingTag(tag)
    setName(tag.name)
    setSlug(tag.slug)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name || !slug) {
      alert("Vui lòng điền đầy đủ thông tin")
      return
    }

    setSaving(true)

    try {
      const url = editingTag
        ? `/api/admin/blog/tags/${editingTag.id}`
        : "/api/admin/blog/tags"
      
      const method = editingTag ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to save tag")
      }

      alert(editingTag ? "Đã cập nhật tag" : "Đã tạo tag mới")
      setDialogOpen(false)
      fetchTags()
    } catch (error: any) {
      console.error("Error saving tag:", error)
      alert(error.message || "Có lỗi xảy ra")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tag này?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/tags/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete tag")
      }

      alert("Đã xóa tag")
      fetchTags()
    } catch (error: any) {
      console.error("Error deleting tag:", error)
      alert(error.message || "Có lỗi xảy ra")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Tags Blog</h1>
          <p className="text-muted-foreground">
            Quản lý tags cho bài viết
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Chỉnh sửa tag" : "Tạo tag mới"}
              </DialogTitle>
              <DialogDescription>
                {editingTag
                  ? "Cập nhật thông tin tag"
                  : "Thêm tag mới cho blog"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="name">Tên tag *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ví dụ: Netflix"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="netflix"
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
                {editingTag ? "Cập nhật" : "Tạo mới"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tags</CardTitle>
          <CardDescription>
            Tổng cộng {tags.length} tags
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : tags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có tag nào
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-center">Số bài viết</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>
                      <Badge variant="secondary">{tag.name}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      /{tag.slug}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge>{tag._count.posts}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(tag)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(tag.id)}
                          disabled={tag._count.posts > 0}
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
