# MVP ROADMAP - HỆ THỐNG BÁN TÀI KHOẢN DIGITAL

## 🎯 Tổng quan dự án

**Mục tiêu**: Xây dựng nền tảng bán tài khoản số tự động, an toàn và dễ sử dụng

**Timeline dự kiến**: 6-8 tháng (từ MVP đến Production)

---

## 📋 GIAI ĐOẠN 1: MVP CORE (4-6 tuần)

### Mục tiêu
✅ Tạo hệ thống cơ bản có thể bán hàng và quản lý đơn hàng  
✅ Xác thực được ý tưởng với nhóm khách hàng nhỏ  
✅ Thu thập feedback đầu tiên  

### Tech Stack
```
Frontend: Next.js 14 + TypeScript + Tailwind CSS
Backend: Next.js API Routes / Node.js + Express
Database: PostgreSQL + Prisma ORM
Auth: NextAuth.js
Payment: Manual (Bank Transfer)
Hosting: Vercel (Frontend) + Railway/Render (Database)
```

### Features Core

#### 1. Authentication System (1 tuần)
- [ ] Đăng ký/Đăng nhập (email + password)
- [ ] Reset password
- [ ] Email verification
- [ ] Session management
- [ ] Basic role: User, Admin

**Database Schema:**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  balance       Decimal   @default(0)
  role          Role      @default(USER)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  USER
  ADMIN
}
```

#### 2. Product Management (1 tuần)
- [ ] CRUD sản phẩm (Admin only)
- [ ] Danh sách sản phẩm (Public)
- [ ] Chi tiết sản phẩm
- [ ] Quản lý inventory (kho hàng)
- [ ] Upload images

**Database Schema:**
```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  price       Decimal
  imageUrl    String?
  stock       Int      @default(0)
  sold        Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id])
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orders      Order[]
  accounts    Account[]
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  products    Product[]
}
```

#### 3. Account Storage System (1 tuần)
- [ ] Upload tài khoản số (bulk import)
- [ ] Mã hóa thông tin nhạy cảm
- [ ] Auto-assign tài khoản khi có đơn
- [ ] Đánh dấu tài khoản đã bán

**Database Schema:**
```prisma
model Account {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  content     String   @db.Text // Encrypted account data
  status      AccountStatus @default(AVAILABLE)
  soldAt      DateTime?
  orderId     String?
  order       Order?   @relation(fields: [orderId], references: [id])
  createdAt   DateTime @default(now())
}

enum AccountStatus {
  AVAILABLE
  RESERVED
  SOLD
}
```

#### 4. Order System (1.5 tuần)
- [ ] Tạo đơn hàng
- [ ] Tự động trừ số dư ví
- [ ] Tự động gán tài khoản
- [ ] Hiển thị thông tin tài khoản sau mua
- [ ] Lịch sử đơn hàng
- [ ] Download/Copy tài khoản

**Database Schema:**
```prisma
model Order {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  productId     String
  product       Product     @relation(fields: [productId], references: [id])
  quantity      Int
  totalPrice    Decimal
  status        OrderStatus @default(PENDING)
  accounts      Account[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

enum OrderStatus {
  PENDING
  COMPLETED
  CANCELLED
  REFUNDED
}
```

#### 5. Wallet & Deposit System (1.5 tuần)
- [ ] Hiển thị số dư
- [ ] Tạo yêu cầu nạp tiền
- [ ] Admin xác nhận nạp tiền (manual)
- [ ] Lịch sử giao dịch
- [ ] Transaction log

**Database Schema:**
```prisma
model Transaction {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id])
  type        TransactionType
  amount      Decimal
  balanceBefore Decimal
  balanceAfter  Decimal
  status      TransactionStatus @default(PENDING)
  note        String?
  proofImage  String?         // Bank transfer proof
  approvedBy  String?         // Admin ID
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
}

enum TransactionType {
  DEPOSIT
  PURCHASE
  REFUND
}

enum TransactionStatus {
  PENDING
  COMPLETED
  REJECTED
}
```

#### 6. Admin Dashboard (1 tuần)
- [ ] Overview statistics
- [ ] Quản lý đơn hàng
- [ ] Quản lý users
- [ ] Xác nhận nạp tiền
- [ ] Quản lý sản phẩm
- [ ] Upload tài khoản hàng loạt

### UI/UX Pages
```
/                       -> Landing page
/products               -> Danh sách sản phẩm
/products/[slug]        -> Chi tiết sản phẩm
/login                  -> Đăng nhập
/register               -> Đăng ký
/dashboard              -> User dashboard
/dashboard/orders       -> Lịch sử đơn hàng
/dashboard/wallet       -> Ví & nạp tiền
/dashboard/profile      -> Thông tin cá nhân
/admin                  -> Admin dashboard
/admin/products         -> Quản lý sản phẩm
/admin/orders           -> Quản lý đơn hàng
/admin/users            -> Quản lý users
/admin/deposits         -> Xác nhận nạp tiền
```

### Deployment MVP 1
- [ ] Setup CI/CD with GitHub Actions
- [ ] Deploy to Vercel
- [ ] Setup PostgreSQL on Railway
- [ ] Configure environment variables
- [ ] Setup monitoring (Sentry)

---

## 📋 GIAI ĐOẠN 2: AUTOMATION & OPTIMIZATION (3-4 tuần)

### Mục tiêu
✅ Tự động hóa các quy trình thủ công  
✅ Tối ưu hiệu suất và trải nghiệm  
✅ Tăng khả năng scale  

### Features

#### 1. Auto Payment Integration (1 tuần)
- [ ] Tích hợp API ngân hàng (Vietcombank/ACB)
- [ ] Auto verify bank transfer
- [ ] Webhook nhận thông báo chuyển khoản
- [ ] Auto cộng tiền vào ví

**Tech Stack:**
```
- Casso API / SepPay / Bank API
- Webhook handling
- Queue system (Bull/BullMQ)
```

#### 2. Real-time Features (1 tuần)
- [ ] Live order feed (Socket.io)
- [ ] Live deposit feed
- [ ] Real-time stock updates
- [ ] Notification system

**Tech Stack:**
```
- Socket.io / Pusher / Supabase Realtime
- Redis for pub/sub
```

#### 3. Email System (3 ngày)
- [ ] Welcome email
- [ ] Order confirmation
- [ ] Deposit confirmation
- [ ] Account delivery email
- [ ] Marketing emails

**Tech Stack:**
```
- Resend / SendGrid / AWS SES
- React Email for templates
```

#### 4. Search & Filter (3 ngày)
- [ ] Full-text search
- [ ] Filter by category
- [ ] Sort by price, popularity
- [ ] Pagination

**Tech Stack:**
```
- PostgreSQL full-text search
- Or Algolia/MeiliSearch for advanced
```

#### 5. Cache Layer (4 ngày)
- [ ] Redis caching
- [ ] API response cache
- [ ] Static page cache
- [ ] Session store

**Tech Stack:**
```
- Redis
- Next.js ISR (Incremental Static Regeneration)
```

---

## 📋 GIAI ĐOẠN 3: SCALE & FEATURES (3-4 tuần)

### Mục tiêu
✅ Mở rộng tính năng thu hút khách hàng  
✅ Tăng revenue và retention  
✅ Xây dựng community  

### Features

#### 1. Affiliate System (1.5 tuần)
- [ ] Generate affiliate code
- [ ] Track referrals
- [ ] Commission calculation
- [ ] Payout management
- [ ] Affiliate dashboard

**Database Schema:**
```prisma
model Affiliate {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  code            String   @unique
  commissionRate  Decimal  @default(10) // %
  totalEarned     Decimal  @default(0)
  totalWithdrawn  Decimal  @default(0)
  createdAt       DateTime @default(now())
  
  referrals       Referral[]
}

model Referral {
  id          String   @id @default(cuid())
  affiliateId String
  affiliate   Affiliate @relation(fields: [affiliateId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  orderId     String?
  commission  Decimal
  status      CommissionStatus @default(PENDING)
  createdAt   DateTime @default(now())
}
```

#### 2. API Integration (1 tuần)
- [ ] REST API documentation
- [ ] API key management
- [ ] Rate limiting
- [ ] Webhook for order updates
- [ ] SDK for popular languages

**Endpoints:**
```
GET    /api/v1/products
GET    /api/v1/products/:id
POST   /api/v1/orders
GET    /api/v1/orders/:id
GET    /api/v1/balance
POST   /api/v1/webhooks
```

#### 3. Multi-language Support (4 ngày)
- [ ] i18n setup (next-intl)
- [ ] Vietnamese
- [ ] English
- [ ] Thai (optional)
- [ ] Chinese (optional)

#### 4. Multi-currency (3 ngày)
- [ ] VND
- [ ] USD
- [ ] Auto currency conversion
- [ ] Display prices in user currency

#### 5. Review & Rating System (1 tuần)
- [ ] Product reviews
- [ ] Star rating
- [ ] Review moderation
- [ ] Average rating display

**Database Schema:**
```prisma
model Review {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  rating      Int      // 1-5
  comment     String?  @db.Text
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

#### 6. Blog/CMS (3 ngày)
- [ ] Create blog posts
- [ ] Category management
- [ ] SEO optimization
- [ ] Rich text editor

---

## 📋 GIAI ĐOẠN 4: ADVANCED & SCALE (2-3 tuần)

### Mục tiêu
✅ Tối ưu hoàn toàn hệ thống  
✅ Chuẩn bị scale lớn  
✅ Advanced features  

### Features

#### 1. Advanced Security (1 tuần)
- [ ] Two-factor authentication (2FA)
- [ ] Login history
- [ ] Device management
- [ ] IP whitelist
- [ ] Anti-fraud system
- [ ] Rate limiting advanced
- [ ] DDoS protection

#### 2. Analytics & Reporting (4 ngày)
- [ ] Revenue dashboard
- [ ] User behavior tracking
- [ ] Product performance
- [ ] Conversion funnel
- [ ] Export reports

**Tech Stack:**
```
- Google Analytics 4
- Custom analytics dashboard
- Chart.js / Recharts
```

#### 3. Advanced Inventory (3 ngày)
- [ ] Auto restock alerts
- [ ] Supplier management
- [ ] Batch operations
- [ ] Product variants
- [ ] Bundle products

#### 4. Customer Support (4 ngày)
- [ ] Live chat (Tawk.to / Crisp)
- [ ] Ticket system
- [ ] FAQ dynamic
- [ ] Knowledge base
- [ ] Chatbot integration

#### 5. Marketing Tools (1 tuần)
- [ ] Discount codes
- [ ] Flash sales
- [ ] Loyalty program
- [ ] Email campaigns
- [ ] Push notifications
- [ ] SMS marketing

**Database Schema:**
```prisma
model Coupon {
  id          String   @id @default(cuid())
  code        String   @unique
  type        CouponType
  value       Decimal
  minPurchase Decimal?
  maxUses     Int?
  usedCount   Int      @default(0)
  startDate   DateTime
  endDate     DateTime
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

#### 6. Mobile App (Optional - 3 tuần)
- [ ] React Native app
- [ ] Push notifications
- [ ] Biometric login
- [ ] In-app purchases

---

## 📋 GIAI ĐOẠN 5: ENTERPRISE READY (2-3 tuần)

### Mục tiêu
✅ Sẵn sàng cho khách hàng lớn  
✅ Compliance & Legal  
✅ White-label solution  

### Features

#### 1. Enterprise Features
- [ ] Custom domain per seller
- [ ] White-label solution
- [ ] Multi-vendor support
- [ ] Advanced permissions
- [ ] SLA guarantees

#### 2. Compliance
- [ ] GDPR compliance
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Cookie consent
- [ ] Data export/deletion

#### 3. Advanced Infrastructure
- [ ] Microservices architecture
- [ ] Load balancing
- [ ] CDN optimization
- [ ] Database replication
- [ ] Backup automation

#### 4. DevOps Excellence
- [ ] Kubernetes deployment
- [ ] Auto-scaling
- [ ] Health checks
- [ ] Log aggregation (ELK)
- [ ] APM (Application Performance Monitoring)

---

## 🛠️ TECH STACK EVOLUTION

### Phase 1 (MVP)
```
Frontend: Next.js 14 + TypeScript + Tailwind
Backend: Next.js API Routes
Database: PostgreSQL + Prisma
Auth: NextAuth.js
Deployment: Vercel + Railway
```

### Phase 2-3 (Growth)
```
+ Redis (caching)
+ Socket.io (realtime)
+ Bull/BullMQ (job queue)
+ AWS S3 (file storage)
+ Resend (email)
+ Stripe/PayPal (international payment)
```

### Phase 4-5 (Scale)
```
+ Kubernetes
+ Microservices
+ Message Queue (RabbitMQ/Kafka)
+ Elasticsearch (advanced search)
+ Grafana (monitoring)
+ Cloudflare (CDN + security)
```

---

## 📊 TIMELINE OVERVIEW

```
Month 1-1.5: MVP Core
Month 2:     Automation & Optimization  
Month 3:     Scale & Features
Month 4:     Advanced Features
Month 5-6:   Enterprise Ready (optional)
```

---

## 💰 ESTIMATED COSTS

### MVP Phase
```
Domain:           $10/year
Vercel (Hobby):   Free
Railway (DB):     $5-20/month
Email service:    Free tier
Total:            ~$15-30/month
```

### Growth Phase
```
VPS/Cloud:        $50-100/month
Redis:            $10-20/month
CDN:              $20-50/month
Email:            $20-50/month
Monitoring:       $20/month
Total:            ~$120-240/month
```

### Scale Phase
```
Cloud (AWS/GCP):  $500-2000/month
CDN:              $100-300/month
Services:         $200-500/month
Total:            ~$800-2800/month
```

---

## 🎯 SUCCESS METRICS

### MVP
- [ ] 10+ registered users
- [ ] 5+ successful orders
- [ ] < 3s page load time
- [ ] 95%+ uptime

### Growth
- [ ] 100+ users
- [ ] 50+ orders/day
- [ ] < 1s API response
- [ ] 99%+ uptime

### Scale
- [ ] 1000+ users
- [ ] 500+ orders/day
- [ ] Multi-region deployment
- [ ] 99.9%+ uptime

---

## 📝 NOTES

1. **Ưu tiên MVP**: Tập trung làm features core trước, validation sau
2. **Feedback loop**: Thu thập feedback sau mỗi giai đoạn
3. **Security first**: Không compromise security vì speed
4. **Test coverage**: Aim for 70%+ coverage từ Phase 2
5. **Documentation**: Document API và code từ đầu
6. **Scalability**: Design for scale nhưng deploy for current needs

---

## 🚀 GETTING STARTED

1. Clone starter template
2. Setup database
3. Configure environment variables
4. Start with Authentication system
5. Build incrementally, test frequently
6. Deploy early, deploy often

**Ready to build? Let's start with Phase 1! 🎉**
