import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Tạo categories
  console.log('Creating categories...')
  const tinTucMMO = await prisma.postCategory.upsert({
    where: { slug: 'tin-tuc-mmo' },
    update: {},
    create: {
      name: 'Tin tức MMO',
      slug: 'tin-tuc-mmo',
      description: 'Cập nhật tin tức mới nhất về thị trường MMO, các sàn giao dịch, và xu hướng kiếm tiền online',
      order: 1
    }
  })

  const huongDan = await prisma.postCategory.upsert({
    where: { slug: 'huong-dan' },
    update: {},
    create: {
      name: 'Hướng dẫn',
      slug: 'huong-dan',
      description: 'Hướng dẫn chi tiết về Google Ads, Google Cloud, AI và các công cụ MMO',
      order: 2
    }
  })

  const review = await prisma.postCategory.upsert({
    where: { slug: 'review' },
    update: {},
    create: {
      name: 'Review',
      slug: 'review',
      description: 'Review sản phẩm, dịch vụ MMO, so sánh các nền tảng',
      order: 3
    }
  })

  console.log('✅ Categories created:', { tinTucMMO, huongDan, review })

  // 2. Tạo tags
  console.log('Creating tags...')
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'taphoammo' },
      update: {},
      create: { name: 'taphoammo', slug: 'taphoammo' }
    }),
    prisma.tag.upsert({
      where: { slug: 'google-ads' },
      update: {},
      create: { name: 'Google Ads', slug: 'google-ads' }
    }),
    prisma.tag.upsert({
      where: { slug: 'google-cloud' },
      update: {},
      create: { name: 'Google Cloud', slug: 'google-cloud' }
    }),
    prisma.tag.upsert({
      where: { slug: 'taphoammoi' },
      update: {},
      create: { name: 'Taphoammoi', slug: 'taphoammoi' }
    })
  ])

  console.log('✅ Tags created:', tags.length)

  // 3. Lấy admin user
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@selldigital.vn' }
  })

  if (!admin) {
    console.error('❌ Admin user not found!')
    return
  }

  // 4. Đọc content từ file HTML
  const fs = await import('fs')
  const content = fs.readFileSync('./blog-taphoammo-content.html', 'utf-8')

  // 5. Tạo blog post
  console.log('Creating blog post...')
  const post = await prisma.post.create({
    data: {
      title: 'Nghi vấn Taphoammo.net đóng cửa vĩnh viễn: Do dính líu pháp lý hay Scam nhà bán hàng? Đâu là lối đi mới cho dân MMO?',
      slug: 'taphoammo-dong-cua-lua-dao-phan-tich',
      excerpt: 'Taphoammo.net đột ngột sập - hàng ngàn người hoang mang vì tiền kẹt, đơn hàng dở dang. Phân tích 2 giả thuyết: Vấn đề pháp lý hay Exit Scam? Khám phá giải pháp thay thế an toàn với Taphoammoi.com - chuyên Google Ads & Cloud.',
      content: content,
      status: 'PUBLISHED',
      published: true,
      publishedAt: new Date(),
      authorId: admin.id,
      categoryId: tinTucMMO.id,
      metaTitle: 'Taphoammo.net Đóng Cửa: Scam Hay Dính Líu Pháp Lý? Web Thay Thế MMO 2025',
      metaDescription: 'Phân tích sâu nguyên nhân taphoammo.net sập - vấn đề pháp lý bán via hack hay exit scam? Giải pháp thay thế an toàn với Taphoammoi.com chuyên Google Ads, GCP, AI.',
      metaKeywords: 'taphoammo lừa đảo, taphoammo bị bắt, taphoammo scam, web thay thế taphoammo, mua google ads, google cloud platform, sàn mmo uy tín, taphoammoi, google ads trả sau'
    }
  })

  console.log('✅ Blog post created:', post.id)

  // 6. Gắn tags cho post
  console.log('Attaching tags to post...')
  await Promise.all(
    tags.map(tag => 
      prisma.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id
        }
      })
    )
  )

  console.log('✅ Tags attached to post')

  console.log('\n🎉 Blog post published successfully!')
  console.log(`📝 Title: ${post.title}`)
  console.log(`🔗 URL: https://taphoammoi.com/blog/${post.slug}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
