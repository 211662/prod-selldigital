"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, Wallet, User, Settings, LayoutDashboard, Package } from "lucide-react"
import { cn } from "@/lib/utils"

interface DashboardNavProps {
  user: {
    role: string
  }
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname()

  const userLinks = [
    { href: "/dashboard", label: "Tổng quan", icon: Home },
    { href: "/dashboard/products", label: "Sản phẩm", icon: Package },
    { href: "/dashboard/orders", label: "Đơn hàng", icon: ShoppingCart },
    { href: "/dashboard/wallet", label: "Ví tiền", icon: Wallet },
    { href: "/dashboard/profile", label: "Tài khoản", icon: User },
  ]

  const adminLinks = [
    { href: "/admin", label: "Admin", icon: LayoutDashboard },
    { href: "/admin/products", label: "Quản lý sản phẩm", icon: Package },
    { href: "/admin/orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
    { href: "/admin/deposits", label: "Yêu cầu nạp tiền", icon: Wallet },
    { href: "/admin/users", label: "Quản lý người dùng", icon: User },
  ]

  const links = user.role === "ADMIN" ? [...userLinks, ...adminLinks] : userLinks

  return (
    <nav className="w-64 bg-white border-r min-h-[calc(100vh-64px)]">
      <div className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {link.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
