import { z } from "zod"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

// Client-side register schema (with confirmPassword)
export const registerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
})

// Server-side register schema (without confirmPassword)
export const registerServerSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
})

// Product Schemas
export const productSchema = z.object({
  name: z.string().min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  slug: z.string().min(3, "Slug phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  price: z.number().min(0, "Giá phải lớn hơn 0"),
  categoryId: z.string().min(1, "Vui lòng chọn danh mục"),
  imageUrl: z.string().url("URL ảnh không hợp lệ").optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
})

// Category Schema
export const categorySchema = z.object({
  name: z.string().min(2, "Tên danh mục phải có ít nhất 2 ký tự"),
  slug: z.string().min(2, "Slug phải có ít nhất 2 ký tự"),
  description: z.string().optional(),
  image: z.string().url("URL ảnh không hợp lệ").optional(),
  order: z.number().default(0),
  isActive: z.boolean().default(true),
})

// Transaction Schema
export const depositSchema = z.object({
  amount: z.number().min(10000, "Số tiền nạp tối thiểu là 10,000đ"),
  proofImage: z.string().url("Vui lòng upload ảnh chứng từ"),
  note: z.string().optional(),
})

// Order Schema
export const createOrderSchema = z.object({
  productId: z.string(),
  quantity: z.number().min(1, "Số lượng phải lớn hơn 0"),
})

// Account Upload Schema
export const accountUploadSchema = z.object({
  productId: z.string(),
  accounts: z.array(z.string()).min(1, "Phải có ít nhất 1 tài khoản"),
})

// Review Schema
export const reviewSchema = z.object({
  orderId: z.string(),
  productId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
})

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").optional(),
  email: z.string().email("Email không hợp lệ").optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, "Mật khẩu mới phải có ít nhất 6 ký tự").optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword) {
      return data.currentPassword && data.newPassword === data.confirmPassword
    }
    return true
  },
  {
    message: "Mật khẩu mới không khớp hoặc thiếu mật khẩu hiện tại",
    path: ["confirmPassword"],
  }
)

// Types
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type DepositInput = z.infer<typeof depositSchema>
export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type AccountUploadInput = z.infer<typeof accountUploadSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>
