"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Upload } from "lucide-react"

const depositSchema = z.object({
  amount: z.string().min(1, "Số tiền là bắt buộc"),
  note: z.string().optional(),
  proofImage: z.string().optional(),
})

type DepositFormData = z.infer<typeof depositSchema>

interface DepositFormProps {
  userId: string
}

export default function DepositForm({ userId }: DepositFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  })

  const onSubmit = async (data: DepositFormData) => {
    setIsLoading(true)

    try {
      const amount = parseFloat(data.amount)

      if (amount < 10000) {
        throw new Error("Số tiền nạp tối thiểu 10,000đ")
      }

      const response = await fetch("/api/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          note: data.note || "",
          proofImage: data.proofImage || "",
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Gửi yêu cầu thất bại")
      }

      toast({
        title: "Gửi yêu cầu thành công",
        description: "Yêu cầu nạp tiền đang chờ duyệt",
      })

      router.push("/dashboard/wallet")
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="amount">Số tiền nạp (VNĐ) *</Label>
        <Input
          id="amount"
          type="number"
          step="1000"
          {...register("amount")}
          placeholder="500000"
        />
        {errors.amount && (
          <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">Số tiền tối thiểu: 10,000đ</p>
      </div>

      <div>
        <Label htmlFor="note">Ghi chú (không bắt buộc)</Label>
        <textarea
          id="note"
          {...register("note")}
          rows={3}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Thông tin bổ sung..."
        />
      </div>

      <div>
        <Label htmlFor="proofImage">Link ảnh chuyển khoản (không bắt buộc)</Label>
        <Input
          id="proofImage"
          type="url"
          {...register("proofImage")}
          placeholder="https://..."
        />
        <p className="text-sm text-gray-500 mt-1">
          Upload ảnh lên Imgur, ImgBB... và dán link vào đây
        </p>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full" size="lg">
        <Upload className="w-4 h-4 mr-2" />
        {isLoading ? "Đang gửi..." : "Gửi yêu cầu nạp tiền"}
      </Button>
    </form>
  )
}
