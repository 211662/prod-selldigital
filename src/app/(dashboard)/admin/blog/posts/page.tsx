"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Eye, Edit, Trash2, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Post {
  id: string
  title: string
  slug: string
  status: string
  published: boolean
  publishedAt: string | null
  viewCount: number
  featuredImage: string | null
  author: {
    name: string | null
    email: string
  }
  category: {
    name: string
  }
  _count: {
    comments: number
  }
}

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [status, setStatus] = useState("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchPosts()
  }, [page, status])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      })

      if (status !== "ALL") {
        params.append("status", status)
      }

      if (search) {
        params.append("search", search)
      }

      const response = await fetch(`/api/admin/blog/posts?${params}`)
      const data = await response.json()

      if (response.ok) {
        setPosts(data.posts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch (error) {
      console.error("Fetch posts error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchPosts()
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  const getStatusColor = (status: string, published: boolean) => {
    if (published) return "default"
    if (status === "DRAFT") return "secondary"
    if (status === "ARCHIVED") return "outline"
    return "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Tạo và quản lý bài viết blog
          </p>
        </div>
        <Link href="/admin/blog/posts/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bài viết..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Tìm</Button>
            </form>

            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có bài viết nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài viết</TableHead>
                    <TableHead>Tác giả</TableHead>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Lượt xem</TableHead>
                    <TableHead className="text-right">Bình luận</TableHead>
                    <TableHead>Ngày xuất bản</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {post.featuredImage && (
                            <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                              <Image
                                src={post.featuredImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {post.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              /{post.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {post.author.name || post.author.email}
                      </TableCell>
                      <TableCell>{post.category.name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={getStatusColor(
                            post.status,
                            post.published
                          )}
                        >
                          {post.published ? "Published" : post.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {post.viewCount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post._count.comments}
                      </TableCell>
                      <TableCell>
                        {post.publishedAt
                          ? formatDate(new Date(post.publishedAt))
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/blog/${post.slug}`} target="_blank">
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/blog/posts/${post.id}/edit`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Trang trước
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                  >
                    Trang sau
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
