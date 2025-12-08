"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

interface ApproveDepositButtonProps {
  depositId: string
}

export default function ApproveDepositButton({ depositId }: ApproveDepositButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    if (!confirm("Xác nhận duyệt yêu cầu nạp tiền này?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/deposits/${depositId}/approve`, {
        method: "POST",
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Duyệt thất bại")
      }

      toast({
        title: "Duyệt thành công",
        description: "Số dư đã được cập nhật",
      })

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
    <Button
      onClick={handleApprove}
      disabled={isLoading}
      size="sm"
      className="bg-green-600 hover:bg-green-700"
    >
      <CheckCircle className="w-4 h-4 mr-1" />
      Duyệt
    </Button>
  )
}
