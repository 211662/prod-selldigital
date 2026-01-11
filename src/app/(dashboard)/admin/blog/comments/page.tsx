"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Check, X, Trash2, ExternalLink } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface Comment {
  id: string
  content: string
  status: string
  createdAt: string
  user: {
    id: string
    name: string | null
    email: string
  }
  post: {
    id: string
    title: string
    slug: string
  }
  parent: {
    id: string
    content: string
    user: {
      name: string | null
      email: string
    }
  } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState("ALL")
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchComments()
  }, [status, pagination.page])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/admin/blog/comments?status=${status}&page=${pagination.page}&limit=${pagination.limit}`
      )
      const data = await response.json()
      setComments(data.comments)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching comments:", error)
      alert("Không thể tải danh sách bình luận")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update comment")
      }

      alert("Đã cập nhật trạng thái bình luận")
      fetchComments()
    } catch (error) {
      console.error("Error updating comment:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bình luận này? (Bao gồm các trả lời)")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/blog/comments/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete comment")
      }

      alert("Đã xóa bình luận")
      fetchComments()
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "default"
      case "PENDING":
        return "secondary"
      case "REJECTED":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt"
      case "PENDING":
        return "Chờ duyệt"
      case "REJECTED":
        return "Từ chối"
      default:
        return status
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bình luận</h1>
          <p className="text-muted-foreground">
            Phê duyệt và quản lý bình luận từ người dùng
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Danh sách bình luận</CardTitle>
              <CardDescription>
                Tổng cộng {pagination.total} bình luận
              </CardDescription>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Chưa có bình luận nào
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bài viết</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <Link
                            href={`/blog/${comment.post.slug}`}
                            target="_blank"
                            className="text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <p className="truncate font-medium">
                              {comment.post.title}
                            </p>
                            <ExternalLink className="w-3 h-3 flex-shrink-0" />
                          </Link>
                          {comment.parent && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Trả lời: {comment.parent.user.name || comment.parent.user.email}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {comment.user.name || "N/A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {comment.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md">
                          <p className="line-clamp-2 text-sm">
                            {comment.content}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(comment.status)}>
                          {getStatusText(comment.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(comment.createdAt))}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {comment.status !== "APPROVED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(comment.id, "APPROVED")
                              }
                              title="Phê duyệt"
                            >
                              <Check className="w-4 h-4 text-green-600" />
                            </Button>
                          )}
                          {comment.status !== "REJECTED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(comment.id, "REJECTED")
                              }
                              title="Từ chối"
                            >
                              <X className="w-4 h-4 text-red-600" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(comment.id)}
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                      }))
                    }
                    disabled={pagination.page === 1}
                  >
                    Trước
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Trang {pagination.page} / {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                      }))
                    }
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Sau
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
