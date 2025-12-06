import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create admin user
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10
  )

  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@example.com' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 0,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create demo user
  const demoPassword = await bcrypt.hash('demo123', 10)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: demoPassword,
      role: 'USER',
      balance: 1000000,
    },
  })
  console.log('✅ Demo user created:', demoUser.email)

  // Create categories
  const categories = [
    {
      name: 'Google Ads',
      slug: 'google-ads',
      description: 'Tài khoản Google Ads chất lượng cao',
      order: 1,
    },
    {
      name: 'Facebook Ads',
      slug: 'facebook-ads',
      description: 'Tài khoản Facebook Ads ngưỡng cao',
      order: 2,
    },
    {
      name: 'TikTok Ads',
      slug: 'tiktok-ads',
      description: 'Tài khoản TikTok Ads Agency',
      order: 3,
    },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Categories created')

  // Create products
  const googleAdsCategory = await prisma.category.findUnique({
    where: { slug: 'google-ads' },
  })

  if (googleAdsCategory) {
    const products = [
      {
        name: 'Tài khoản Google Ads Việt Kháng',
        slug: 'tai-khoan-google-ads-viet-khang',
        description: `Tài Khoản GG ADS Việt Kháng Lỗi Lách Hệ Thống, Đã Xác Minh Nhà Quảng Cáo, Bao Xác Minh Lại
        
        ✅ Tài khoản đã xác minh đầy đủ
        ✅ Kháng lỗi tốt
        ✅ Hỗ trợ chạy VPCS
        ✅ Bảo hành 1 đổi 1`,
        price: 350000,
        categoryId: googleAdsCategory.id,
        stock: 50,
        isFeatured: true,
      },
      {
        name: 'Tài khoản Google Ads US Ngưỡng',
        slug: 'tai-khoan-google-ads-us-nguong',
        description: `Tài Khoản US Ngưỡng 10$ Paid Nhảy Ngưỡng 50$ - Đã XM Full - Không Mất Thuế
        
        ✅ Ngưỡng 10$ tự động nhảy 50$
        ✅ Đã xác minh đầy đủ
        ✅ Không mất thuế
        ✅ Thanh toán Visa/Master`,
        price: 130000,
        categoryId: googleAdsCategory.id,
        stock: 30,
        isFeatured: true,
      },
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      })
    }
    console.log('✅ Products created')

    // Create sample accounts for products
    const product1 = await prisma.product.findUnique({
      where: { slug: 'tai-khoan-google-ads-viet-khang' },
    })

    if (product1) {
      for (let i = 1; i <= 5; i++) {
        await prisma.account.create({
          data: {
            productId: product1.id,
            content: `Email: demo${i}@gmail.com\nPassword: demo${i}123456\nRecovery: recovery${i}@gmail.com`,
            status: 'AVAILABLE',
          },
        })
      }
      console.log('✅ Sample accounts created')
    }
  }

  // Create system settings
  const settings = [
    {
      key: 'site_name',
      value: 'SellDigital',
      description: 'Tên website',
    },
    {
      key: 'min_deposit',
      value: '10000',
      description: 'Số tiền nạp tối thiểu',
    },
    {
      key: 'bank_account',
      value: JSON.stringify({
        bank: 'ACB',
        accountNumber: '123456789',
        accountName: 'NGUYEN VAN A',
      }),
      description: 'Thông tin tài khoản ngân hàng',
    },
  ]

  for (const setting of settings) {
    await prisma.settings.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Settings created')

  console.log('🎉 Seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
