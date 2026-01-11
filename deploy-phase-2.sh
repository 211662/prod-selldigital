#!/bin/bash

# Script to deploy Phase 2 - Affiliate System with commission tracking

echo "🚀 Phase 2 Deployment Script"
echo "================================"
echo ""

# Step 1: Generate Prisma Client
echo "📦 Step 1: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generate failed!"
  exit 1
fi

echo "✅ Prisma Client generated"
echo ""

# Step 2: Create migration
echo "🗄️  Step 2: Creating database migration..."
npx prisma migrate dev --name add-affiliate-system

if [ $? -ne 0 ]; then
  echo "❌ Migration failed!"
  exit 1
fi

echo "✅ Migration created"
echo ""

# Step 3: Build app
echo "🏗️  Step 3: Building application..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Build failed!"
  exit 1
fi

echo "✅ Build successful"
echo ""

# Step 4: Commit changes
echo "📝 Step 4: Committing changes..."
git add .
git commit -m "feat: Phase 2 - Affiliate System

- Add Affiliate, Referral, AffiliateWithdrawal models
- Create affiliate API routes (register, stats, withdraw, referrals)
- Build affiliate dashboard UI with earnings tracking
- Implement referral tracking on registration
- Add referral code validation and storage

Next: Commission calculation + admin management UI"

echo "✅ Changes committed"
echo ""

# Step 5: Push to GitHub
echo "📤 Step 5: Pushing to GitHub..."
git push origin main

if [ $? -ne 0 ]; then
  echo "⚠️  Push failed - may need to configure git credentials"
  echo "To push manually:"
  echo "  git push origin main"
fi

echo "✅ Phase 2 deployment complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Test locally at http://localhost:3000/dashboard/affiliate"
echo "2. Deploy to production:"
echo "   ssh root@139.59.111.150"
echo "   cd /var/www/selldigital"
echo "   git pull && npx prisma migrate deploy && npm run build && pm2 restart selldigital"
echo ""
echo "3. Verify on http://139.59.111.150/dashboard/affiliate"
echo ""
echo "📋 Remaining tasks:"
echo "- Add commission calculation to orders API"
echo "- Create admin affiliate management UI"
echo "- Test full referral → purchase → commission flow"
