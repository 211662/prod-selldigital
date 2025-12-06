# 📋 PHASE 1 - CÔNG NGHỆ VÀ CẤU TRÚC CHI TIẾT

## 🎯 Overview

Phase 1 là giai đoạn xây dựng MVP Core với đầy đủ các tính năng cơ bản để hệ thống có thể hoạt động và bán hàng.

---

## 🛠️ TECH STACK CHI TIẾT

### 1. Frontend Framework
```
Next.js 14.0.4 (App Router)
- Server Components
- Server Actions
- Route Handlers
- Middleware
- Image Optimization
```

**Lý do chọn:**
- ✅ Full-stack framework (Frontend + Backend)
- ✅ SEO-friendly với SSR/SSG
- ✅ File-based routing
- ✅ Built-in API routes
- ✅ Cộng đồng lớn, nhiều tài liệu

### 2. TypeScript
```
TypeScript 5.x
- Type safety
- Better IDE support
- Catch errors at compile time
```

### 3. Styling
```
Tailwind CSS 3.3.x
- Utility-first CSS
- Responsive design
- Dark mode support
- Custom theme

tailwindcss-animate
- Pre-built animations
```

### 4. UI Components
```
Shadcn UI + Radix UI
- Accessible components
- Customizable
- No runtime dependencies
- Copy-paste philosophy

Lucide React
- Beautiful icons
- Tree-shakeable
```

**Components cần:**
- Button, Input, Card
- Dialog, Dropdown Menu
- Toast, Badge, Tabs
- Table, Form, Select
- Avatar, Separator, Label

### 5. Backend & API
```
Next.js API Routes
- RESTful endpoints
- Server Actions
- Middleware authentication
```

### 6. Database
```
PostgreSQL 14+
- Relational database
- ACID compliant
- Excellent performance
- JSON support

Prisma ORM 5.7.x
- Type-safe queries
- Auto-generated types
- Migration system
- Prisma Studio (GUI)
```

**Schema Models:**
- User (authentication, wallet)
- Product & Category
- Account (inventory)
- Order & OrderItem
- Transaction (wallet)
- Affiliate & Referral
- Review
- Settings

### 7. Authentication
```
NextAuth.js v5 (Beta)
- JWT strategy
- Credentials provider
- Session management
- Middleware protection

bcryptjs
- Password hashing
- Salt rounds: 10
```

### 8. Validation
```
Zod
- Schema validation
- Type inference
- Error messages

React Hook Form
- Form state management
- Validation integration
- Performance optimized
```

### 9. File Upload
```
UploadThing
- Easy file uploads
- Image optimization
- CDN delivery
- Free tier available
```

### 10. Email Service
```
Resend
- Modern email API
- React Email templates
- High deliverability
- Free tier: 3000 emails/month
```

---

## 📁 PROJECT STRUCTURE CHI TIẾT

```
prod-selldigital/
│
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Sample data seeding
│
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── register/
│   │   │       └── page.tsx
│   │   │
│   │   ├── (dashboard)/      # Dashboard route group (protected)
│   │   │   ├── layout.tsx    # Dashboard layout
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx  # User dashboard
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── wallet/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── profile/
│   │   │   │       └── page.tsx
│   │   │   │
│   │   │   └── admin/        # Admin pages
│   │   │       ├── page.tsx  # Admin dashboard
│   │   │       ├── products/
│   │   │       │   ├── page.tsx
│   │   │       │   ├── new/
│   │   │       │   │   └── page.tsx
│   │   │       │   └── [id]/
│   │   │       │       └── edit/
│   │   │       │           └── page.tsx
│   │   │       ├── orders/
│   │   │       │   └── page.tsx
│   │   │       ├── users/
│   │   │       │   └── page.tsx
│   │   │       ├── deposits/
│   │   │       │   └── page.tsx
│   │   │       └── accounts/
│   │   │           └── upload/
│   │   │               └── page.tsx
│   │   │
│   │   ├── api/              # API Routes
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── products/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── orders/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   ├── transactions/
│   │   │   │   ├── route.ts
│   │   │   │   └── deposit/
│   │   │   │       └── route.ts
│   │   │   ├── admin/
│   │   │   │   ├── products/
│   │   │   │   ├── orders/
│   │   │   │   ├── users/
│   │   │   │   └── deposits/
│   │   │   └── uploadthing/
│   │   │       └── route.ts
│   │   │
│   │   ├── products/         # Public product pages
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Home page
│   │   ├── globals.css       # Global styles
│   │   └── not-found.tsx     # 404 page
│   │
│   ├── components/           # React Components
│   │   ├── ui/              # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   └── label.tsx
│   │   │
│   │   ├── layout/          # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── UserMenu.tsx
│   │   │
│   │   ├── products/        # Product components
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductDetail.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── CategoryFilter.tsx
│   │   │
│   │   ├── orders/          # Order components
│   │   │   ├── OrderCard.tsx
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   └── AccountDisplay.tsx
│   │   │
│   │   ├── wallet/          # Wallet components
│   │   │   ├── BalanceCard.tsx
│   │   │   ├── DepositForm.tsx
│   │   │   └── TransactionList.tsx
│   │   │
│   │   ├── admin/           # Admin components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── DataTable.tsx
│   │   │   ├── AccountUpload.tsx
│   │   │   └── ApproveDepositDialog.tsx
│   │   │
│   │   └── forms/           # Form components
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ProfileForm.tsx
│   │       └── PasswordChangeForm.tsx
│   │
│   ├── lib/                 # Library/Utility code
│   │   ├── prisma.ts        # Prisma client singleton
│   │   ├── auth.ts          # NextAuth configuration
│   │   ├── utils.ts         # Utility functions
│   │   ├── encryption.ts    # Encryption helpers
│   │   ├── validations.ts   # Zod schemas
│   │   └── constants.ts     # App constants
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useUser.ts       # Current user hook
│   │   ├── useProducts.ts   # Products data hook
│   │   ├── useOrders.ts     # Orders data hook
│   │   └── useToast.ts      # Toast notifications
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts         # Common types & interfaces
│   │
│   └── middleware.ts        # Next.js middleware (auth)
│
├── public/                  # Static assets
│   ├── images/
│   └── favicon.ico
│
├── .env.example             # Environment variables template
├── .env                     # Environment variables (gitignored)
├── .gitignore              # Git ignore rules
├── .eslintrc.json          # ESLint configuration
├── next.config.js          # Next.js configuration
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── README.md               # Project documentation
├── MVP_ROADMAP.md          # Development roadmap
└── SETUP_GUIDE.md          # Setup instructions
```

---

## 📦 DEPENDENCIES BREAKDOWN

### Production Dependencies
```json
{
  "@auth/prisma-adapter": "^1.0.12",      // NextAuth Prisma adapter
  "@hookform/resolvers": "^3.3.4",         // Form validation resolvers
  "@prisma/client": "^5.7.1",              // Prisma client
  "@radix-ui/*": "Multiple packages",      // UI primitives
  "@uploadthing/react": "^6.0.2",          // File upload
  "bcryptjs": "^2.4.3",                    // Password hashing
  "class-variance-authority": "^0.7.0",    // CVA for variants
  "clsx": "^2.1.0",                        // Classname utility
  "date-fns": "^3.0.6",                    // Date manipulation
  "lucide-react": "^0.303.0",              // Icons
  "next": "14.0.4",                        // Next.js framework
  "next-auth": "^5.0.0-beta.4",           // Authentication
  "react": "^18.2.0",                      // React
  "react-dom": "^18.2.0",                  // React DOM
  "react-hook-form": "^7.49.3",           // Form management
  "resend": "^3.0.0",                      // Email service
  "tailwind-merge": "^2.2.0",             // Tailwind merger
  "tailwindcss-animate": "^1.0.7",        // Tailwind animations
  "uploadthing": "^6.1.0",                // File upload backend
  "zod": "^3.22.4"                         // Validation
}
```

### Development Dependencies
```json
{
  "@types/*": "Multiple packages",         // TypeScript types
  "autoprefixer": "^10.0.1",               // PostCSS plugin
  "eslint": "^8",                          // Linting
  "eslint-config-next": "14.0.4",         // Next.js ESLint
  "postcss": "^8",                         // CSS processor
  "prisma": "^5.7.1",                      // Prisma CLI
  "tailwindcss": "^3.3.0",                // Tailwind CSS
  "tsx": "^4.7.0",                         // TypeScript executor
  "typescript": "^5"                       // TypeScript
}
```

---

## 🗄️ DATABASE SCHEMA OVERVIEW

### User Management
- **User**: Authentication + wallet + role
- **Role**: USER, ADMIN

### Product Catalog
- **Category**: Product categories
- **Product**: Products for sale
- **Account**: Digital inventory (encrypted)

### Order System
- **Order**: Customer orders
- **OrderItem**: Order line items
- **OrderStatus**: PENDING, PROCESSING, COMPLETED, CANCELLED, REFUNDED

### Wallet System
- **Transaction**: Deposits, purchases, refunds
- **TransactionType**: DEPOSIT, PURCHASE, REFUND, AFFILIATE_EARNING, WITHDRAWAL
- **TransactionStatus**: PENDING, COMPLETED, REJECTED, CANCELLED

### Marketing
- **Affiliate**: Affiliate program
- **Referral**: Referral tracking
- **Review**: Product reviews

### System
- **Settings**: Dynamic configuration

---

## 🔐 SECURITY FEATURES

### 1. Authentication
```typescript
- JWT-based sessions
- Secure password hashing (bcrypt)
- Email verification support
- Role-based access control (RBAC)
```

### 2. Data Protection
```typescript
- Environment variables for secrets
- Account data encryption (AES-256-CBC)
- SQL injection prevention (Prisma)
- XSS protection (React escaping)
```

### 3. API Security
```typescript
- Middleware authentication
- Rate limiting (planned)
- CORS configuration
- Input validation (Zod)
```

---

## 🎨 UI/UX DESIGN PRINCIPLES

### 1. Color Scheme
```
Primary: Blue (#3b82f6)
Secondary: Gray
Success: Green
Error: Red
Warning: Yellow
```

### 2. Typography
```
Font: Inter (default)
Headings: Bold, larger
Body: Regular, readable
```

### 3. Components Style
```
- Rounded corners (radius: 0.5rem)
- Subtle shadows
- Smooth transitions
- Hover states
- Focus indicators
```

### 4. Responsive Design
```
Mobile: < 640px
Tablet: 640px - 1024px
Desktop: > 1024px
```

---

## 🚀 DEVELOPMENT WORKFLOW

### 1. Setup
```bash
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 2. Development
```bash
npm run dev              # Start dev server
npx prisma studio        # Database GUI
npm run type-check       # TypeScript check
npm run lint            # Lint code
```

### 3. Database Changes
```bash
# Modify prisma/schema.prisma
npx prisma format       # Format schema
npx prisma generate     # Generate client
npx prisma db push      # Push to database
```

### 4. Testing Flow
```
1. Create feature branch
2. Implement feature
3. Test manually
4. Check types & lint
5. Commit & push
6. Create PR
```

---

## 📊 MVP FEATURES CHECKLIST

### Authentication ✅
- [x] User registration
- [x] Login/Logout
- [x] Password hashing
- [x] Session management
- [ ] Email verification
- [ ] Password reset

### Product Management 🔄
- [ ] List products (public)
- [ ] Product details
- [ ] Filter by category
- [ ] Admin: CRUD products
- [ ] Admin: Upload accounts
- [ ] Stock management

### Order System 🔄
- [ ] Create order
- [ ] View order history
- [ ] Download accounts
- [ ] Admin: View all orders
- [ ] Auto assign accounts

### Wallet System 🔄
- [ ] View balance
- [ ] Request deposit
- [ ] Upload payment proof
- [ ] Admin: Approve deposits
- [ ] Transaction history

### Admin Dashboard 🔄
- [ ] Statistics overview
- [ ] Manage products
- [ ] Manage orders
- [ ] Manage users
- [ ] Approve deposits
- [ ] Upload accounts bulk

### User Interface 🔄
- [ ] Responsive design
- [ ] Loading states
- [ ] Error handling
- [ ] Success messages
- [ ] Form validation

---

## 🎯 NEXT STEPS

1. ✅ **Setup hoàn tất**
   - Project structure
   - Dependencies
   - Database schema
   - Configuration files

2. 🔄 **Implement Features**
   - Start với Authentication
   - Product catalog
   - Order system
   - Wallet & deposits

3. 📝 **Testing**
   - Manual testing
   - Fix bugs
   - User feedback

4. 🚀 **Deploy MVP**
   - Vercel deployment
   - Database hosting
   - Environment setup

---

## 💡 BEST PRACTICES

### Code Style
```typescript
- Use TypeScript strict mode
- Follow ESLint rules
- Consistent naming conventions
- Comment complex logic
- Keep components small
```

### Git Workflow
```bash
- Meaningful commit messages
- Feature branches
- Regular commits
- Pull requests for review
```

### Performance
```typescript
- Use Next.js Image component
- Implement loading states
- Lazy load components
- Optimize database queries
- Cache when possible
```

### Security
```typescript
- Never commit .env files
- Validate all inputs
- Sanitize user data
- Use HTTPS in production
- Regular dependency updates
```

---

## 📞 SUPPORT & RESOURCES

### Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Shadcn UI](https://ui.shadcn.com)

### Community
- Next.js Discord
- Prisma Slack
- Stack Overflow
- GitHub Discussions

---

**🎉 Setup hoàn tất! Sẵn sàng để code!**
