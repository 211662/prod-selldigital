# 🚀 QUICK START GUIDE

## Bắt đầu trong 10 phút!

---

## ⚡ TL;DR - Quick Commands

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your database URL

# 3. Setup database
npx prisma generate
npx prisma db push
npm run prisma:seed

# 4. Run development
npm run dev

# 5. Open browser
# http://localhost:3000
```

**Login:** admin@example.com / admin123

---

## 📋 Prerequisites Check

```bash
# Check Node.js version (need >= 18)
node --version

# Check npm version
npm --version

# Check if PostgreSQL is running
psql --version
```

**Không có PostgreSQL?** → Install via:
- macOS: `brew install postgresql@14`
- Windows: Download from postgresql.org
- Ubuntu: `sudo apt install postgresql-14`

---

## 🗄️ Database Setup

### Option 1: Local PostgreSQL

```bash
# Start PostgreSQL
brew services start postgresql@14  # macOS
# or
sudo service postgresql start       # Ubuntu

# Create database
createdb selldigital

# Update .env
DATABASE_URL="postgresql://localhost:5432/selldigital?schema=public"
```

### Option 2: Railway (Free Cloud Database)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Provision PostgreSQL
4. Copy connection string
5. Paste to `.env`

```env
DATABASE_URL="postgresql://postgres:xxx@containers-xxx.railway.app:5432/railway"
```

### Option 3: Supabase (Free Cloud Database)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Session mode")
5. Paste to `.env`

---

## 🔑 Environment Variables

Edit `.env` file:

```env
# Database (REQUIRED)
DATABASE_URL="postgresql://user:password@localhost:5432/selldigital"

# NextAuth (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-32-character-string-here"

# Encryption (REQUIRED)
ENCRYPTION_KEY="generate-32-character-key-here"

# Optional (for Phase 2)
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""
RESEND_API_KEY=""
EMAIL_FROM=""
```

### Generate Random Keys

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate ENCRYPTION_KEY (must be exactly 32 chars)
openssl rand -base64 24
```

---

## 📦 Install Dependencies

```bash
npm install
```

**Lỗi?** Try:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🗃️ Initialize Database

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed sample data
npm run prisma:seed
```

**Seed creates:**
- Admin user: admin@example.com / admin123
- Demo user: demo@example.com / demo123
- 2 categories
- 2 products
- 5 sample accounts

---

## 🏃 Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🎯 Test the System

### 1. Login as Admin
```
URL: http://localhost:3000/login
Email: admin@example.com
Password: admin123
```

### 2. View Products
```
URL: http://localhost:3000/products
- See 2 sample products
- Click to view details
```

### 3. Create Order (as demo user)
```
1. Logout
2. Login as: demo@example.com / demo123
3. Go to Products
4. Buy a product (demo user has 1,000,000đ balance)
5. Check order history
```

### 4. Admin Dashboard
```
1. Login as admin
2. Go to: http://localhost:3000/admin
3. View statistics
4. Manage products, orders, users
```

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # TypeScript check
```

### Database
```bash
npx prisma studio        # Open database GUI
npx prisma format        # Format schema file
npx prisma generate      # Regenerate client
npx prisma db push       # Push schema changes
npx prisma db pull       # Pull from database
npx prisma migrate dev   # Create migration
```

### Reset Database
```bash
npx prisma db push --force-reset
npm run prisma:seed
```

---

## 📂 Important Files

```
.env                          # Your configuration
prisma/schema.prisma          # Database schema
src/lib/auth.ts              # Authentication config
src/app/api/                 # API endpoints
src/app/(dashboard)/         # Protected pages
```

---

## 🐛 Common Issues

### Issue 1: "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Issue 2: "Environment variable not found: DATABASE_URL"
```bash
# Make sure .env exists and has DATABASE_URL
cp .env.example .env
# Edit .env
```

### Issue 3: Port 3000 already in use
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill
```

### Issue 4: Database connection error
```bash
# Check PostgreSQL is running
brew services list           # macOS
sudo service postgresql status  # Ubuntu

# Check DATABASE_URL is correct
echo $DATABASE_URL
```

### Issue 5: "Error: NEXTAUTH_SECRET is not set"
```bash
# Add to .env
NEXTAUTH_SECRET="your-32-character-secret-here"
```

---

## 📚 Next Steps

### Learn the Codebase
1. Read `PHASE1_TECH_STACK.md`
2. Explore `src/app/` structure
3. Check `prisma/schema.prisma`
4. Look at `src/components/`

### Start Developing
1. Pick a feature from MVP_ROADMAP.md
2. Create feature branch
3. Implement & test
4. Commit & push

### Suggested First Tasks
- [ ] Add product search
- [ ] Improve product card design
- [ ] Add pagination to product list
- [ ] Create order detail page
- [ ] Add deposit request form

---

## 🎨 Design System

### Colors
```
Primary: Blue (#3b82f6)
Success: Green (#10b981)
Error: Red (#ef4444)
Warning: Yellow (#f59e0b)
```

### Spacing
```
sm: 0.5rem
md: 1rem
lg: 1.5rem
xl: 2rem
```

### Components
All UI components are in `src/components/ui/`
- Built with Radix UI
- Styled with Tailwind
- Fully customizable

---

## 🔗 Helpful Links

- **Next.js**: https://nextjs.org/docs
- **Prisma**: https://www.prisma.io/docs
- **NextAuth**: https://next-auth.js.org
- **Tailwind**: https://tailwindcss.com
- **Shadcn UI**: https://ui.shadcn.com

---

## 💬 Need Help?

1. Check documentation files
2. Search GitHub issues
3. Ask in team chat
4. Create GitHub issue

---

## ✅ Quick Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL running
- [ ] Dependencies installed
- [ ] .env configured
- [ ] Database initialized
- [ ] Seed data loaded
- [ ] Dev server running
- [ ] Can login as admin
- [ ] Can view products
- [ ] Can create orders

**All checked?** 🎉 You're ready to develop!

---

## 🚀 Deploy to Production

Coming soon... See `DEPLOYMENT.md`

---

**Happy Coding! 🎉**
