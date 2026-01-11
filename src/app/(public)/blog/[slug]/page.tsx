import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User, Eye, MessageCircle, ArrowLeft } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"

async function getPost(slug: string) {
  const post = await prisma.post.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      comments: {
        where: {
          status: "APPROVED",
          parentId: null,
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post) {
    return null
  }

  // Increment view count
  await prisma.post.update({
    where: { id: post.id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })

  return post
}

async function getRelatedPosts(categoryId: string, currentPostId: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      categoryId,
      id: {
        not: currentPostId,
      },
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
      category: true,
    },
    take: 3,
    orderBy: {
      publishedAt: "desc",
    },
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.categoryId, post.id)

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/blog">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Blog
          </Button>
        </Link>

        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-8">
            <Badge className="mb-4">{post.category.name}</Badge>
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(new Date(post.publishedAt!))}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.viewCount.toLocaleString()} lượt xem</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments.length} bình luận</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-[400px] w-full">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-8">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="px-8 py-4 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <Link
                    key={tag.id}
                    href={`/blog/tag/${tag.slug}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    #{tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
          <div className="p-8 bg-gray-50 border-t">
            <div className="flex items-center gap-4">
              {post.author.image && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <Image
                    src={post.author.image}
                    alt={post.author.name || "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{post.author.name}</h3>
                <p className="text-gray-600 text-sm">Tác giả</p>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="p-8 border-t">
            <h3 className="text-2xl font-bold mb-6">
              Bình luận ({post.comments.length})
            </h3>
            {post.comments.length === 0 ? (
              <p className="text-gray-500">Chưa có bình luận nào.</p>
            ) : (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    {comment.user.image && (
                      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src={comment.user.image}
                          alt={comment.user.name || "User"}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">
                            {comment.user.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(new Date(comment.createdAt))}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    {relatedPost.featuredImage && (
                      <div className="relative h-48">
                        <Image
                          src={relatedPost.featuredImage}
                          alt={relatedPost.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <Badge className="mb-2 text-xs">
                        {relatedPost.category.name}
                      </Badge>
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {relatedPost.author.name}
                      </p>
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
