# SellDigital MVP

Nền tảng bán tài khoản số tự động

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: NextAuth.js v5
- **UI Components**: Shadcn UI + Radix UI
- **File Upload**: UploadThing
- **Email**: Resend

## 📋 Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 14
- npm/yarn/pnpm

## 🛠️ Installation

```bash
# Clone repository
git clone <your-repo>
cd prod-selldigital

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configurations

# Setup database
npx prisma generate
npx prisma db push

# Seed database with sample data
npm run prisma:seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📦 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages (login, register)
│   ├── (dashboard)/       # Dashboard pages
│   ├── api/               # API routes
│   ├── products/          # Product pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── layout/           # Layout components
│   └── ...               # Feature components
├── lib/                   # Library code
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Auth configuration
│   ├── utils.ts          # Utility functions
│   ├── encryption.ts     # Encryption helpers
│   └── validations.ts    # Zod schemas
└── types/                # TypeScript types

prisma/
├── schema.prisma         # Database schema
└── seed.ts              # Database seeding
```

## 🔑 Default Credentials

After seeding:

**Admin Account:**
- Email: admin@example.com
- Password: admin123

**Demo User:**
- Email: demo@example.com
- Password: demo123

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Prisma commands
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to database
npm run prisma:studio    # Open Prisma Studio (DB GUI)
npm run prisma:seed      # Seed database
```

## 🗃️ Database Schema

Main models:
- **User**: User accounts with roles (USER, ADMIN)
- **Product**: Products for sale
- **Category**: Product categories
- **Account**: Digital accounts inventory
- **Order**: Customer orders
- **Transaction**: Wallet transactions
- **Affiliate**: Affiliate program
- **Review**: Product reviews

## 🔐 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Account data encryption
- Role-based access control (RBAC)
- Environment variable protection

## 📚 Documentation

See additional documentation:
- [MVP Roadmap](./MVP_ROADMAP.md) - Development phases
- [Setup Guide](./SETUP_GUIDE.md) - Detailed setup instructions

## 🌐 Environment Variables

Required environment variables:

```env
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_URL=         # App URL
NEXTAUTH_SECRET=      # NextAuth secret (min 32 chars)
ENCRYPTION_KEY=       # Encryption key (32 chars)
UPLOADTHING_SECRET=   # UploadThing secret
UPLOADTHING_APP_ID=   # UploadThing app ID
RESEND_API_KEY=       # Resend API key
```

## 🚧 Development Status

Current Phase: **MVP Core (Phase 1)**

Completed:
- [x] Project setup
- [x] Database schema
- [x] Authentication system
- [ ] Product management
- [ ] Order system
- [ ] Wallet & deposits
- [ ] Admin dashboard

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines first.

## 📞 Support

For support, email: support@yourdomain.com
