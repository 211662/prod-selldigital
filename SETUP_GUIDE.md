# 🚀 HƯỚNG DẪN SETUP DỰ ÁN - PHASE 1 (MVP)

## Prerequisites

```bash
Node.js >= 18.x
npm hoặc yarn hoặc pnpm
PostgreSQL >= 14
Git
```

---

## BƯỚC 1: KHỞI TẠO DỰ ÁN

### 1.1 Tạo Next.js Project

```bash
# Sử dụng create-next-app với TypeScript
npx create-next-app@latest selldigital-mvp --typescript --tailwind --app --use-npm

cd selldigital-mvp
```

**Chọn options:**
```
✔ Would you like to use TypeScript? … Yes
✔ Would you like to use ESLint? … Yes
✔ Would you like to use Tailwind CSS? … Yes
✔ Would you like to use `src/` directory? … Yes
✔ Would you like to use App Router? … Yes
✔ Would you like to customize the default import alias? … No
```

### 1.2 Install Dependencies

```bash
# Core dependencies
npm install @prisma/client
npm install -D prisma

# Authentication
npm install next-auth@beta
npm install bcryptjs
npm install -D @types/bcryptjs

# Form handling & validation
npm install react-hook-form
npm install zod
npm install @hookform/resolvers

# UI Components
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-select
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install lucide-react
npm install class-variance-authority
npm install clsx tailwind-merge

# Date handling
npm install date-fns

# File upload
npm install uploadthing
npm install @uploadthing/react

# Environment variables
npm install dotenv
```

---

## BƯỚC 2: SETUP DATABASE

### 2.1 Initialize Prisma

```bash
npx prisma init
```

### 2.2 Configure .env

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/selldigital?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-min-32-characters"

# UploadThing (for file uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@yourdomain.com"

# App Config
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="SellDigital"
```

### 2.3 Create Prisma Schema

Tạo file `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  password      String
  balance       Decimal   @default(0) @db.Decimal(12, 2)
  role          Role      @default(USER)
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  orders        Order[]
  transactions  Transaction[]
  affiliate     Affiliate?
  referrals     Referral[]
  reviews       Review[]
  
  @@index([email])
}

enum Role {
  USER
  ADMIN
}

model Category {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?   @db.Text
  image       String?
  order       Int       @default(0)
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  products    Product[]
  
  @@index([slug])
}

model Product {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String   @db.Text
  price       Decimal  @db.Decimal(12, 2)
  imageUrl    String?
  stock       Int      @default(0)
  sold        Int      @default(0)
  categoryId  String
  category    Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  isActive    Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  metadata    Json?    // Flexible data: warranty, specs, etc.
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  orders      OrderItem[]
  accounts    Account[]
  reviews     Review[]
  
  @@index([slug])
  @@index([categoryId])
}

model Account {
  id          String        @id @default(cuid())
  productId   String
  product     Product       @relation(fields: [productId], references: [id], onDelete: Cascade)
  content     String        @db.Text // Encrypted account credentials
  status      AccountStatus @default(AVAILABLE)
  soldAt      DateTime?
  orderItemId String?       @unique
  orderItem   OrderItem?    @relation(fields: [orderItemId], references: [id])
  createdAt   DateTime      @default(now())
  
  @@index([productId, status])
}

enum AccountStatus {
  AVAILABLE
  RESERVED
  SOLD
}

model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique // Human-readable order number
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  totalAmount Decimal     @db.Decimal(12, 2)
  status      OrderStatus @default(PENDING)
  note        String?     @db.Text
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  
  items       OrderItem[]
  
  @@index([userId])
  @@index([orderNumber])
}

model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  quantity    Int
  price       Decimal  @db.Decimal(12, 2)
  subtotal    Decimal  @db.Decimal(12, 2)
  
  account     Account?
  
  @@index([orderId])
}

enum OrderStatus {
  PENDING
  PROCESSING
  COMPLETED
  CANCELLED
  REFUNDED
}

model Transaction {
  id            String            @id @default(cuid())
  userId        String
  user          User              @relation(fields: [userId], references: [id])
  type          TransactionType
  amount        Decimal           @db.Decimal(12, 2)
  balanceBefore Decimal           @db.Decimal(12, 2)
  balanceAfter  Decimal           @db.Decimal(12, 2)
  status        TransactionStatus @default(PENDING)
  note          String?           @db.Text
  proofImage    String?
  approvedBy    String?
  approvedAt    DateTime?
  createdAt     DateTime          @default(now())
  updatedAt     DateTime          @updatedAt
  
  @@index([userId])
  @@index([status])
}

enum TransactionType {
  DEPOSIT
  PURCHASE
  REFUND
  AFFILIATE_EARNING
  WITHDRAWAL
}

enum TransactionStatus {
  PENDING
  COMPLETED
  REJECTED
  CANCELLED
}

model Affiliate {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  code            String   @unique
  commissionRate  Decimal  @default(10) @db.Decimal(5, 2) // Percentage
  totalEarned     Decimal  @default(0) @db.Decimal(12, 2)
  totalWithdrawn  Decimal  @default(0) @db.Decimal(12, 2)
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  referrals       Referral[]
  
  @@index([code])
}

model Referral {
  id          String           @id @default(cuid())
  affiliateId String
  affiliate   Affiliate        @relation(fields: [affiliateId], references: [id])
  userId      String
  user        User             @relation(fields: [userId], references: [id])
  orderId     String?
  commission  Decimal          @db.Decimal(12, 2)
  status      CommissionStatus @default(PENDING)
  paidAt      DateTime?
  createdAt   DateTime         @default(now())
  
  @@index([affiliateId])
  @@index([userId])
}

enum CommissionStatus {
  PENDING
  APPROVED
  PAID
  CANCELLED
}

model Review {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  orderId     String   @unique
  rating      Int      // 1-5
  comment     String?  @db.Text
  isApproved  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([productId, isApproved])
}

model Settings {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String   @db.Text
  description String?
  updatedAt   DateTime @updatedAt
}
```

### 2.4 Generate Prisma Client

```bash
npx prisma generate
npx prisma db push
```

---

## BƯỚC 3: PROJECT STRUCTURE

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── orders/
│   │   │   ├── wallet/
│   │   │   └── profile/
│   │   └── admin/
│   │       ├── page.tsx
│   │       ├── products/
│   │       ├── orders/
│   │       ├── users/
│   │       └── deposits/
│   ├── api/
│   │   ├── auth/
│   │   ├── products/
│   │   ├── orders/
│   │   ├── transactions/
│   │   └── admin/
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/              # Shadcn components
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── products/
│   │   ├── ProductCard.tsx
│   │   ├── ProductList.tsx
│   │   └── ProductDetail.tsx
│   ├── orders/
│   └── forms/
├── lib/
│   ├── prisma.ts        # Prisma client
│   ├── auth.ts          # Auth config
│   ├── utils.ts         # Utilities
│   └── validations/     # Zod schemas
├── hooks/
│   ├── useUser.ts
│   └── useProducts.ts
└── types/
    └── index.ts
```

---

## BƯỚC 4: SETUP AUTHENTICATION

### 4.1 Create Prisma Client

Tạo `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### 4.2 Setup NextAuth

Tạo `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) {
          throw new Error("Invalid credentials")
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string
      }
      return session
    },
  },
}
```

### 4.3 Create Auth API Route

Tạo `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

---

## BƯỚC 5: CREATE BASIC COMPONENTS

### 5.1 Install Shadcn UI

```bash
npx shadcn-ui@latest init
```

```bash
# Install components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add tabs
```

---

## BƯỚC 6: CREATE SAMPLE PAGES

### 6.1 Home Page

Tạo `src/app/page.tsx`:

```typescript
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12">
      <h1 className="text-4xl font-bold mb-4">
        Welcome to SellDigital
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Nền tảng bán tài khoản số tự động
      </p>
      <div className="flex gap-4">
        <Link href="/products">
          <Button size="lg">Xem Sản Phẩm</Button>
        </Link>
        <Link href="/register">
          <Button size="lg" variant="outline">Đăng Ký</Button>
        </Link>
      </div>
    </div>
  )
}
```

### 6.2 Login Page

Tạo `src/app/(auth)/login/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        alert('Đăng nhập thất bại')
      } else {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Đăng Nhập</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## BƯỚC 7: RUN THE PROJECT

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Prisma Studio (Database GUI)
npx prisma studio
```

Open [http://localhost:3000](http://localhost:3000)

---

## BƯỚC 8: SEED DATABASE (Optional)

Tạo `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      balance: 0,
    },
  })

  // Create categories
  const category = await prisma.category.create({
    data: {
      name: 'Google Ads',
      slug: 'google-ads',
      description: 'Tài khoản Google Ads',
    },
  })

  // Create products
  await prisma.product.create({
    data: {
      name: 'Tài khoản Google Ads Việt',
      slug: 'tai-khoan-google-ads-viet',
      description: 'Tài khoản Google Ads Việt Nam chất lượng cao',
      price: 350000,
      stock: 10,
      categoryId: category.id,
    },
  })

  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

Add to `package.json`:

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

Run seed:

```bash
npm install -D ts-node
npx prisma db seed
```

---

## NEXT STEPS

1. ✅ Setup xong MVP Core
2. 🔄 Implement Product CRUD
3. 🔄 Implement Order System
4. 🔄 Implement Wallet & Deposits
5. 🔄 Build Admin Dashboard
6. 🔄 Deploy to production

**Bắt đầu code thôi! 🚀**
