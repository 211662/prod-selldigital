"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart } from "lucide-react"

interface PurchaseFormProps {
  product: {
    id: string
    name: string
    price: number
    slug: string
  }
  userBalance: number
  availableStock: number
}

export default function PurchaseForm({ product, userBalance, availableStock }: PurchaseFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const totalPrice = product.price * quantity
  const canPurchase = userBalance >= totalPrice && availableStock >= quantity && quantity > 0

  const handlePurchase = async () => {
    if (!canPurchase) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Đặt hàng thất bại")
      }

      toast({
        title: "Đặt hàng thành công!",
        description: `Bạn đã mua ${quantity} tài khoản ${product.name}`,
      })

      router.push("/dashboard/orders")
      router.refresh()
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Đặt hàng thất bại",
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (availableStock === 0) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-800 font-medium">Hết hàng</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="quantity">Số lượng</Label>
        <Input
          id="quantity"
          type="number"
          min={1}
          max={availableStock}
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          className="mt-1"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Tổng cộng:</span>
          <span className="font-semibold">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(totalPrice)}
          </span>
        </div>
      </div>

      {!canPurchase && userBalance < totalPrice && (
        <p className="text-sm text-red-600">
          Số dư không đủ. Vui lòng nạp thêm tiền.
        </p>
      )}

      <Button
        onClick={handlePurchase}
        disabled={!canPurchase || isLoading}
        className="w-full"
        size="lg"
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {isLoading ? "Đang xử lý..." : "Mua ngay"}
      </Button>
    </div>
  )
}
