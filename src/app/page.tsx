import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          SellDigital
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Nền tảng bán tài khoản số tự động - Uy tín, An toàn, Nhanh chóng
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Đăng ký
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold text-lg mb-2">An toàn tuyệt đối</h3>
            <p className="text-gray-600">Mã hóa thông tin, bảo mật cao</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold text-lg mb-2">Giao hàng tức thì</h3>
            <p className="text-gray-600">Nhận tài khoản ngay sau thanh toán</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-4xl mb-4">💯</div>
            <h3 className="font-semibold text-lg mb-2">Chất lượng đảm bảo</h3>
            <p className="text-gray-600">Bảo hành 1 đổi 1 nếu có lỗi</p>
          </div>
        </div>
      </div>
    </div>
  )
}
