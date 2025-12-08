"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface ToggleProductStatusButtonProps {
  productId: string
  isActive: boolean
}

export default function ToggleProductStatusButton({
  productId,
  isActive,
}: ToggleProductStatusButtonProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    setIsLoading(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Cập nhật thất bại")
      }

      toast({
        title: "Cập nhật thành công",
        description: `Sản phẩm đã ${!isActive ? "hiển thị" : "ẩn"}`,
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
      variant="outline"
      size="sm"
      onClick={handleToggle}
      disabled={isLoading}
    >
      {isActive ? "Ẩn" : "Hiện"}
    </Button>
  )
}
