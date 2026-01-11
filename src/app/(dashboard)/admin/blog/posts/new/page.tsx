"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import TipTapEditor from "@/components/editor/tiptap-editor"
import { ArrowLeft, Save, Eye } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
}

export default function NewPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    featuredImage: "",
    categoryId: "",
    status: "DRAFT",
    published: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchTags()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/admin/blog/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Fetch categories error:", error)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/admin/blog/tags")
      const data = await response.json()
      setTags(data)
    } catch (error) {
      console.error("Fetch tags error:", error)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: prev.slug || generateSlug(value),
      metaTitle: prev.metaTitle || value.substring(0, 60),
    }))
  }

  const handleSubmit = async (publish: boolean = false) => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      alert("Vui lòng điền đầy đủ tiêu đề, nội dung và danh mục")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/admin/blog/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          published: publish,
          status: publish ? "PUBLISHED" : "DRAFT",
          tags: selectedTags,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(publish ? "Đã xuất bản bài viết!" : "Đã lưu bản nháp!")
        router.push("/admin/blog/posts")
      } else {
        alert(data.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      console.error("Create post error:", error)
      alert("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
            <p className="text-muted-foreground mt-1">
              Viết nội dung blog cho website
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="bai-viet-moi"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  URL: /blog/{formData.slug || "bai-viet-moi"}
                </p>
              </div>

              <div>
                <Label htmlFor="excerpt">Mô tả ngắn (Excerpt)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Mô tả ngắn về bài viết (hiển thị trong danh sách)"
                  rows={3}
                />
              </div>

              <div>
                <Label>Nội dung *</Label>
                <TipTapEditor
                  content={formData.content}
                  onChange={(content) =>
                    setFormData({ ...formData, content })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
              <CardDescription>
                Tối ưu hóa cho công cụ tìm kiếm
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, metaTitle: e.target.value })
                  }
                  placeholder="Tiêu đề hiển thị trên Google (60 ký tự)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaTitle.length}/60 ký tự
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metaDescription: e.target.value,
                    })
                  }
                  placeholder="Mô tả hiển thị trên Google (160 ký tự)"
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.metaDescription.length}/160 ký tự
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={(e) =>
                    setFormData({ ...formData, metaKeywords: e.target.value })
                  }
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Xuất bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Xuất bản ngay
              </Button>
              <Button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Lưu bản nháp
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh mục *</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.categoryId}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoryId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedTags.includes(tag.id)
                        ? "bg-blue-100 text-blue-700 border-blue-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    } border`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hình đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.featuredImage}
                onChange={(e) =>
                  setFormData({ ...formData, featuredImage: e.target.value })
                }
                placeholder="URL hình ảnh"
              />
              {formData.featuredImage && (
                <div className="mt-4">
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="w-full rounded-lg"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
