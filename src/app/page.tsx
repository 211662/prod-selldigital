import Link from "next/link"
import Image from "next/image"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getLatestPosts() {
  return await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 4,
  })
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user) {
    redirect("/dashboard")
  }

  const latestPosts = await getLatestPosts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16"
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          SellDigital
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Nền tảng bán tài khoản số tự động - Uy tín, An toàn, Nhanh chóng
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Đăng ký
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold text-lg mb-2">An toàn tuyệt đối</h3>
            <p className="text-gray-600">Mã hóa thông tin, bảo mật cao</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Giao hàng tức thì</h3>
            <p className="text-gray-600">Nhận tài khoản ngay sau thanh toán</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="font-semibold text-lg mb-2">Chất lượng đảm bảo</h3>
            <p className="text-gray-600">Bảo hành 1 đổi 1 nếu có lỗi</p>
          </div>
        </div>

        {/* Blog Section */}
        {latestPosts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Blog & Tin tức
                </h2>
                <p className="text-gray-600 mt-2">
                  Hướng dẫn, tips & tricks về các dịch vụ streaming
                </p>
              </div>
              <Link
                href="/blog"
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {latestPosts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-shadow bg-white">
                    {post.featuredImage && (
                      <div className="relative h-48">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs">
                        {post.category.name}
                      </Badge>
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(new Date(post.publishedAt!))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewCount}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
