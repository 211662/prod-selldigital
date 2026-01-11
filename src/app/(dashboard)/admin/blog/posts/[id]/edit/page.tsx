"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import TipTapEditor from "@/components/editor/tiptap-editor"
import { ArrowLeft, Save, Eye, Loader2, X } from "lucide-react"
import Link from "next/link"

interface Category {
  id: string
  name: string
}

interface Tag {
  id: string
  name: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string | null
  categoryId: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string | null
  status: string
  publishedAt: string | null
  tags: { tagId: string; tag: { id: string; name: string } }[]
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [metaKeywords, setMetaKeywords] = useState("")
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">("DRAFT")

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch post data
      const postRes = await fetch(`/api/admin/blog/posts/${params.id}`)
      if (!postRes.ok) throw new Error("Failed to fetch post")
      const post: Post = await postRes.json()

      // Fetch categories
      const categoriesRes = await fetch("/api/admin/blog/categories")
      const categoriesData = await categoriesRes.json()
      setCategories(categoriesData)

      // Fetch tags
      const tagsRes = await fetch("/api/admin/blog/tags")
      const tagsData = await tagsRes.json()
      setTags(tagsData)

      // Populate form
      setTitle(post.title)
      setSlug(post.slug)
      setExcerpt(post.excerpt)
      setContent(post.content)
      setFeaturedImage(post.featuredImage || "")
      setCategoryId(post.categoryId)
      setSelectedTags(post.tags.map(t => t.tagId))
      setMetaTitle(post.metaTitle || "")
      setMetaDescription(post.metaDescription || "")
      setMetaKeywords(post.metaKeywords || "")
      setStatus(post.status as "DRAFT" | "PUBLISHED")
    } catch (error) {
      console.error("Error fetching data:", error)
      alert("Không thể tải dữ liệu bài viết")
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

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleSave = async (publishNow: boolean = false) => {
    if (!title || !slug || !categoryId || !content) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    setSaving(true)

    try {
      const response = await fetch(`/api/admin/blog/posts/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          featuredImage: featuredImage || null,
          categoryId,
          tags: selectedTags,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
          metaKeywords: metaKeywords || null,
          status: publishNow ? "PUBLISHED" : status,
          publishedAt: publishNow && status === "DRAFT" ? new Date().toISOString() : undefined,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update post")
      }

      alert(publishNow ? "Đã xuất bản bài viết!" : "Đã lưu bài viết!")
      router.push("/admin/blog/posts")
    } catch (error: any) {
      console.error("Error saving post:", error)
      alert(error.message || "Có lỗi xảy ra khi lưu bài viết")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog/posts">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Lưu nháp
          </Button>
          {status === "DRAFT" && (
            <Button
              onClick={() => handleSave(true)}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              Xuất bản
            </Button>
          )}
          {status === "PUBLISHED" && (
            <Button
              onClick={() => handleSave(false)}
              disabled={saving}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
              Cập nhật
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung chính</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug (URL) *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="bai-viet-cua-toi"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Mô tả ngắn</Label>
                <Input
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Mô tả ngắn gọn về bài viết"
                />
              </div>

              <div>
                <Label>Nội dung *</Label>
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tối ưu SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Tiêu đề SEO (60-70 ký tự)"
                  maxLength={70}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {metaTitle.length}/70 ký tự
                </p>
              </div>

              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Input
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Mô tả SEO (150-160 ký tự)"
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {metaDescription.length}/160 ký tự
                </p>
              </div>

              <div>
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input
                  id="metaKeywords"
                  value={metaKeywords}
                  onChange={(e) => setMetaKeywords(e.target.value)}
                  placeholder="từ khóa 1, từ khóa 2, từ khóa 3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hình ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {featuredImage && (
                <img
                  src={featuredImage}
                  alt="Preview"
                  className="mt-4 rounded-lg w-full h-48 object-cover"
                />
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh mục *</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={categoryId} onValueChange={setCategoryId}>
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
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.id) && (
                      <X className="w-3 h-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trạng thái</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
                {status === "PUBLISHED" ? "Đã xuất bản" : "Nháp"}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
