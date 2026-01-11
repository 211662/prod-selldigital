#!/bin/bash
set -e

echo "🔧 Fixing all code issues..."

cd /Users/linh/Desktop/github/prod-selldigital

# Fix deposits page
cat > src/app/\(dashboard\)/admin/deposits/page.tsx << 'ENDFILE'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate, formatCurrency } from "@/lib/utils"

export default async function AdminDepositsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  const deposits = await prisma.transaction.findMany({
    where: {
      type: "DEPOSIT"
    },
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PENDING: "bg-yellow-100 text-yellow-800",
      COMPLETED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      CANCELLED: "bg-gray-100 text-gray-800",
    }
    return badges[status] || badges.PENDING
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Yêu cầu nạp tiền</h1>
        <p className="text-gray-600">Duyệt các yêu cầu nạp tiền</p>
      </div>

      <div className="space-y-4">
        {deposits.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Chưa có yêu cầu nạp tiền nào
            </CardContent>
          </Card>
        ) : (
          deposits.map((deposit) => (
            <Card key={deposit.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="font-medium">
                      {deposit.user.name || deposit.user.email}
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(Number(deposit.amount))}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(deposit.createdAt)}
                    </div>
                    {deposit.note && (
                      <div className="text-sm text-gray-600 mt-2">
                        <strong>Ghi chú:</strong> {deposit.note}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right space-y-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(deposit.status)}`}>
                      {deposit.status}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
ENDFILE

echo "✅ Fixed deposits page"

# Add all changes
git add -A

# Commit
git commit -m "Fix: All Decimal type errors and deposits page"

# Push
git push origin main

echo ""
echo "========================================="
echo "✅ PUSHED TO GITHUB!"
echo "========================================="
echo ""
echo "Webhook sẽ tự động deploy sau vài giây..."
echo ""
echo "Xem logs:"
echo "ssh root@139.59.111.150 'pm2 logs webhook'"
echo ""
