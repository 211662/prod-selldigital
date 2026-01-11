import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, User, Eye, MessageCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getFeaturedPost() {
  const post = await prisma.post.findFirst({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      category: true,
      _count: {
        select: {
          comments: {
            where: {
              status: "APPROVED",
            },
          },
        },
      },
    },
    orderBy: {
      viewCount: "desc",
    },
  })

  return post
}

async function getPosts(page: number = 1) {
  const limit = 12
  const skip = (page - 1) * limit

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            name: true,
            image: true,
          },
        },
        category: true,
        _count: {
          select: {
            comments: {
              where: {
                status: "APPROVED",
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
    }),
    prisma.post.count({
      where: {
        published: true,
      },
    }),
  ])

  return {
    posts,
    totalPages: Math.ceil(total / limit),
  }
}

async function getCategories() {
  return await prisma.postCategory.findMany({
    orderBy: {
      order: "asc",
    },
    include: {
      _count: {
        select: {
          posts: {
            where: {
              published: true,
            },
          },
        },
      },
    },
  })
}

async function getPopularPosts() {
  return await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      category: true,
    },
    orderBy: {
      viewCount: "desc",
    },
    take: 5,
  })
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = parseInt(searchParams.page || "1")
  const [featuredPost, { posts, totalPages }, categories, popularPosts] =
    await Promise.all([
      getFeaturedPost(),
      getPosts(page),
      getCategories(),
      getPopularPosts(),
    ])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Featured Post */}
        {featuredPost && page === 1 && (
          <div className="mb-12">
            <Link href={`/blog/${featuredPost.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredPost.featuredImage && (
                    <div className="relative h-[400px]">
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <Badge className="w-fit mb-4">
                      {featuredPost.category.name}
                    </Badge>
                    <h1 className="text-4xl font-bold mb-4 hover:text-blue-600 transition-colors">
                      {featuredPost.title}
                    </h1>
                    {featuredPost.excerpt && (
                      <p className="text-gray-600 text-lg mb-6 line-clamp-3">
                        {featuredPost.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        {featuredPost.author.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {featuredPost.viewCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        {featuredPost._count.comments}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold mb-6">Bài viết mới nhất</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                    {post.featuredImage && (
                      <div className="relative h-48">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <Badge className="mb-3">{post.category.name}</Badge>
                      <h3 className="text-xl font-bold mb-2 hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(new Date(post.publishedAt!))}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewCount}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {post._count.comments}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                {page > 1 && (
                  <Link href={`/blog?page=${page - 1}`}>
                    <Button variant="outline">Trang trước</Button>
                  </Link>
                )}
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link href={`/blog?page=${page + 1}`}>
                    <Button variant="outline">Trang sau</Button>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Danh mục</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/blog/category/${cat.slug}`}
                      className="flex items-center justify-between py-2 hover:text-blue-600 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm text-gray-500">
                        ({cat._count.posts})
                      </span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Popular Posts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Bài viết nổi bật</h3>
                <div className="space-y-4">
                  {popularPosts.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                        {post.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {post.viewCount.toLocaleString()} lượt xem
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
