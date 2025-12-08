import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload } from "lucide-react"
import AccountUploadForm from "@/components/admin/account-upload-form"

interface ManageAccountsPageProps {
  params: {
    id: string
  }
}

export default async function ManageAccountsPage({ params }: ManageAccountsPageProps) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      accounts: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!product) {
    notFound()
  }

  const availableCount = product.accounts.filter((acc: any) => acc.status === "AVAILABLE").length
  const soldCount = product.accounts.filter((acc: any) => acc.status === "SOLD").length

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">← Quay lại</Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý tài khoản</h1>
        <p className="text-gray-600">{product.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng số</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{product.accounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Còn lại</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{availableCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Đã bán</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{soldCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <AccountUploadForm productId={product.id} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          {product.accounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có tài khoản nào. Hãy upload tài khoản ở trên.
            </div>
          ) : (
            <div className="space-y-2">
              {product.accounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm font-mono text-gray-600 line-clamp-1">
                      {account.content.substring(0, 50)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        account.status === "AVAILABLE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {account.status === "AVAILABLE" ? "Còn lại" : "Đã bán"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
