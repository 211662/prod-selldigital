"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

interface AccountUploadFormProps {
  productId: string
}

export default function AccountUploadForm({ productId }: AccountUploadFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [accounts, setAccounts] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!accounts.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập danh sách tài khoản",
      })
      return
    }

    setIsLoading(true)

    try {
      // Split by new lines and filter empty lines
      const accountList = accounts
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      if (accountList.length === 0) {
        throw new Error("Không có tài khoản hợp lệ")
      }

      const response = await fetch(`/api/admin/products/${productId}/accounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accounts: accountList }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload thất bại")
      }

      toast({
        title: "Upload thành công",
        description: `Đã thêm ${result.count} tài khoản`,
      })

      setAccounts("")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="accounts">
          Danh sách tài khoản (mỗi tài khoản một dòng)
        </Label>
        <textarea
          id="accounts"
          value={accounts}
          onChange={(e) => setAccounts(e.target.value)}
          rows={10}
          className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
          placeholder="username1|password1
username2|password2
hoặc bất kỳ format nào..."
        />
        <p className="text-sm text-gray-500 mt-2">
          Mỗi dòng là một tài khoản. Có thể nhập theo format: username|password hoặc bất kỳ
          format nào bạn muốn.
        </p>
      </div>

      <Button type="submit" disabled={isLoading}>
        <Upload className="w-4 h-4 mr-2" />
        {isLoading ? "Đang upload..." : "Upload tài khoản"}
      </Button>
    </form>
  )
}
