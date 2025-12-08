"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { XCircle } from "lucide-react"

interface RejectDepositButtonProps {
  depositId: string
}

export default function RejectDepositButton({ depositId }: RejectDepositButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleReject = async () => {
    const reason = prompt("Lý do từ chối (không bắt buộc):")
    
    if (reason === null) return // User cancelled

    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/deposits/${depositId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason || "" }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Từ chối thất bại")
      }

      toast({
        title: "Đã từ chối",
        description: "Yêu cầu nạp tiền đã bị từ chối",
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
      onClick={handleReject}
      disabled={isLoading}
      size="sm"
      variant="outline"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <XCircle className="w-4 h-4 mr-1" />
      Từ chối
    </Button>
  )
}
