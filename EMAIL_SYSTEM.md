# Email System Documentation

## Overview
Phase 3 email system using Resend + React Email for professional, responsive HTML emails.

## Features
✅ Welcome emails for new users
✅ Order confirmation with account credentials
✅ Deposit confirmation emails
✅ Responsive HTML templates
✅ Type-safe email helpers

## Setup

### 1. Get Resend API Key
1. Go to https://resend.com
2. Sign up for free account
3. Get your API key from dashboard
4. Add to `.env`:
```env
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="SellDigital <onboarding@resend.dev>"
```

### 2. Verify Sending Domain (Optional)
For production, verify your domain in Resend:
- Add DNS records
- Update `EMAIL_FROM` to use your domain

### 3. Test Emails
Visit: http://localhost:3000/test/email

## Email Templates

### 1. Welcome Email (`emails/welcome.tsx`)
**When to send:** User registration
**Props:**
```typescript
{
  name: string
}
```

### 2. Order Confirmation (`emails/order-confirmation.tsx`)
**When to send:** After successful order
**Props:**
```typescript
{
  name: string
  orderNumber: string
  productName: string
  quantity: number
  totalAmount: number
  accounts: Array<{
    username: string
    password: string
  }>
}
```

### 3. Deposit Confirmation (`emails/deposit-confirmation.tsx`)
**When to send:** After deposit approval
**Props:**
```typescript
{
  userName: string
  amount: number
  transactionId: string
  date: string
}
```

## Usage

### Method 1: Using Helper Functions (Recommended)
```typescript
import { sendWelcomeEmail, sendOrderConfirmationEmail } from "@/lib/email"

// Send welcome email
await sendWelcomeEmail("user@example.com", "Nguyễn Văn A")

// Send order confirmation
await sendOrderConfirmationEmail("user@example.com", {
  name: "Nguyễn Văn A",
  orderNumber: "ORD123",
  productName: "Netflix Premium",
  quantity: 1,
  totalAmount: 65000,
  accounts: [
    { username: "user@netflix.com", password: "pass123" }
  ]
})
```

### Method 2: Direct API Call
```typescript
const response = await fetch("/api/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    to: "user@example.com",
    type: "welcome",
    data: { name: "User Name" }
  })
})
```

## Integration Points

### 1. User Registration
Add to `/app/api/auth/register/route.ts`:
```typescript
import { sendWelcomeEmail } from "@/lib/email"

// After user creation
await sendWelcomeEmail(user.email, user.name)
```

### 2. Order Creation
Add to `/app/api/orders/route.ts`:
```typescript
import { sendOrderConfirmationEmail } from "@/lib/email"

// After order creation
await sendOrderConfirmationEmail(user.email, {
  name: user.name,
  orderNumber: order.orderNumber,
  productName: product.name,
  quantity: order.quantity,
  totalAmount: order.totalAmount,
  accounts: order.accounts
})
```

### 3. Deposit Approval
Add to `/app/api/deposits/[id]/approve/route.ts`:
```typescript
import { sendDepositConfirmationEmail } from "@/lib/email"

// After deposit approval
await sendDepositConfirmationEmail(user.email, {
  userName: user.name,
  amount: deposit.amount,
  transactionId: deposit.id,
  date: new Date().toLocaleDateString("vi-VN")
})
```

## Development

### Preview Emails Locally
```bash
# Start React Email dev server
npm run email:dev
```

### Create New Email Template
1. Create file in `/emails/` folder:
```tsx
import { Html, Body, Container, Text } from "@react-email/components"

interface MyEmailProps {
  name: string
}

export default function MyEmail({ name }: MyEmailProps) {
  return (
    <Html>
      <Body>
        <Container>
          <Text>Hello {name}</Text>
        </Container>
      </Body>
    </Html>
  )
}
```

2. Add type to `/app/api/email/send/route.ts`
3. Add helper function to `/src/lib/email.ts`

## Troubleshooting

### Email not sending
1. Check RESEND_API_KEY is set correctly
2. Verify email address (Resend free tier restrictions)
3. Check server logs for errors

### Email in spam
1. Verify your sending domain
2. Add SPF, DKIM records
3. Warm up your domain gradually

### Styling issues
1. Use inline styles (not Tailwind in emails)
2. Test in multiple email clients
3. Use React Email components for compatibility

## Rate Limits

**Resend Free Tier:**
- 100 emails/day
- 3,000 emails/month
- Can only send to verified emails

**Upgrade for production:**
- Unlimited verified recipients
- Custom domain sending
- Higher rate limits

## Security

✅ API key stored in environment variables
✅ Server-side email sending only
✅ Input validation on all email data
✅ No sensitive data in email logs

## Next Steps

- [ ] Add email queue for bulk sending
- [ ] Add email templates for password reset
- [ ] Add admin notifications
- [ ] Add email analytics tracking
- [ ] Add unsubscribe functionality
