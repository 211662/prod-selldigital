# PHASE 2 - AFFILIATE SYSTEM DEPLOYMENT GUIDE

## 📋 Overview
Phase 2 implements a complete affiliate marketing system with referral tracking, commission calculations, and withdrawal management.

## ✅ Completed Features

### 1. Database Schema Updates
**File:** `prisma/schema.prisma`

Added models:
- `Affiliate` - Affiliate account with unique code and commission rate
- `Referral` - Tracks referred users and their commissions  
- `AffiliateWithdrawal` - Withdrawal requests from affiliates
- `CommissionStatus` enum - PENDING, APPROVED, PAID, CANCELLED

### 2. API Routes Created
**Location:** `src/app/api/affiliate/`

- `/api/affiliate/register` (POST) - Register as affiliate, generate unique code
- `/api/affiliate/stats` (GET) - Get dashboard stats, earnings, referrals
- `/api/affiliate/referrals` (GET) - List all referrals with filter by status
- `/api/affiliate/withdraw` (POST/GET) - Create withdrawal request, get history

### 3. Frontend UI
**Location:** `src/app/(dashboard)/dashboard/affiliate/page.tsx`

Features:
- Stats cards: Total earned, withdrawn, available balance, total referrals
- Referral link with copy button
- Withdrawal form with bank details
- Withdrawal history table
- Referrals list with commission status

### 4. Referral Tracking
**Files:**
- `src/app/(auth)/register/page.tsx` - Capture `?ref=CODE` from URL
- `src/app/api/auth/register/route.ts` - Create Referral record on signup

Flow:
1. User clicks affiliate link: `/register?ref=ABC123`
2. Code stored in localStorage
3. On registration, create Referral with commission: 0, status: PENDING
4. LocalStorage cleared after successful registration

## 🔧 Remaining Tasks

### 5. Commission Calculation (IN PROGRESS)
**File to update:** `src/app/api/orders/route.ts`

Current status: File uses old auth pattern (`getServerSession` + `authOptions`)

**Required changes:**
```typescript
// 1. Fix imports
import { auth } from "@/lib/auth"  // Replace getServerSession

// 2. Add commission logic in order transaction
await prisma.$transaction(async (tx: any) => {
  // ... existing order creation ...

  // Check if user was referred
  const referral = await tx.referral.findFirst({
    where: {
      userId: session.user.id,
      status: "PENDING",
    },
    include: {
      affiliate: true,
    },
  })

  if (referral) {
    // Calculate commission (e.g., 10% of totalAmount)
    const commissionAmount = totalAmount * (referral.affiliate.commissionRate / 100)

    // Update referral with commission
    await tx.referral.update({
      where: { id: referral.id },
      data: {
        commission: commissionAmount,
        orderId: order.id,
        status: "APPROVED",
      },
    })

    // Update affiliate total earned
    await tx.affiliate.update({
      where: { id: referral.affiliateId },
      data: {
        totalEarned: {
          increment: commissionAmount,
        },
      },
    })

    // Create transaction record
    await tx.transaction.create({
      data: {
        userId: referral.affiliate.userId,
        type: "AFFILIATE_EARNING",
        amount: commissionAmount,
        balanceBefore: 0,  // Affiliate balance is separate
        balanceAfter: 0,
        status: "COMPLETED",
        note: `Hoa hồng từ đơn hàng ${order.orderNumber}`,
      },
    })
  }

  return order
})
```

### 6. Admin Affiliate Management
**File to create:** `src/app/(dashboard)/admin/affiliates/page.tsx`

Features needed:
- List all affiliates with stats
- Approve/reject withdrawal requests
- View affiliate details and referrals
- Update commission rates
- Deactivate affiliates

**API routes to create:**
- `/api/admin/affiliates` - List affiliates, update commission rate
- `/api/admin/affiliates/[id]/toggle` - Activate/deactivate
- `/api/admin/affiliates/withdrawals` - List withdrawal requests
- `/api/admin/affiliates/withdrawals/[id]/approve` - Approve withdrawal
- `/api/admin/affiliates/withdrawals/[id]/reject` - Reject withdrawal

### 7. Navigation Updates
**Files to update:**
- `src/components/dashboard-nav.tsx` or equivalent
- Add "Đại lý" menu item linking to `/dashboard/affiliate`
- Admin menu: Add "Quản lý đại lý" → `/admin/affiliates`

## 🚀 Deployment Steps

### Step 1: Generate Migration
```bash
cd /Users/linh/Desktop/github/prod-selldigital
npx prisma generate
npx prisma migrate dev --name add-affiliate-system
```

### Step 2: Test Locally
```bash
npm run dev
```

Test flow:
1. Register as affiliate at `/dashboard/affiliate`
2. Copy referral link
3. Open incognito, register new user with ref link
4. Login as new user, make a purchase
5. Check affiliate dashboard - should see referral and commission

### Step 3: Deploy to Server
```bash
# Push code to GitHub
git add .
git commit -m "feat: Phase 2 - Affiliate System with commission tracking"
git push origin main

# Webhook will auto-deploy, or manual deploy:
ssh root@139.59.111.150

cd /var/www/selldigital
git pull origin main
npm install
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart selldigital
```

### Step 4: Verify on Production
1. Visit http://139.59.111.150/dashboard/affiliate
2. Register as affiliate
3. Test referral link registration
4. Test commission calculation on purchase
5. Test withdrawal request

## 📊 Database Migration Preview

New tables created:
- `Affiliate` (7 columns)
- `Referral` (9 columns)  
- `AffiliateWithdrawal` (11 columns)

New relations:
- User 1-1 Affiliate
- User 1-N Referral
- Affiliate 1-N Referral

## 🐛 Known Issues & Fixes

### Issue 1: Prisma Decimal Type Errors
**Error:** `Type 'Decimal' is not assignable to type 'number'`

**Fix:** Convert Decimal to number for display:
```typescript
totalEarned: Number(affiliate.totalEarned)
```

### Issue 2: Auth Import Errors
**Error:** `authOptions is not exported`

**Fix:** Use NextAuth v5 pattern:
```typescript
import { auth } from "@/lib/auth"
const session = await auth()
```

### Issue 3: Commission Calculation Decimal
**Error:** Cannot use arithmetic operators on Decimal

**Fix:** Use number calculations or Prisma increment:
```typescript
// Option 1: Number calculations
const commission = Number(totalAmount) * 0.10

// Option 2: Prisma increment (safer for money)
totalEarned: {
  increment: commissionAmount
}
```

## 📈 Success Metrics

After deployment, track:
- Number of affiliates registered
- Total referrals generated
- Total commission earned
- Average commission per affiliate
- Withdrawal requests volume

## 🔐 Security Considerations

1. **Withdrawal Validation**
   - Minimum withdrawal: 100,000 VNĐ
   - Check available balance before withdrawal
   - Admin approval required

2. **Referral Code Uniqueness**
   - 8-character alphanumeric codes
   - Check uniqueness before creating

3. **Commission Rate Limits**
   - Default: 10%
   - Admin can adjust per affiliate
   - Validate 0-100% range

4. **Anti-Fraud**
   - Prevent self-referrals (same IP/device)
   - Monitor abnormal referral patterns
   - Track first purchase for commission eligibility

## 📝 Next Steps (Phase 3)

After Phase 2 is stable:
- Real-time notifications
- Auto payment integration
- Email notifications for commissions
- Affiliate leaderboard
- Multi-tier commissions
- Lifetime value tracking

---

**Status:** Phase 2 - 85% Complete
**Last Updated:** 2026-01-11
**Estimated Completion:** Add commission logic + admin UI = 2-3 hours
