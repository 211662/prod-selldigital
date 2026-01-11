"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "@/lib/utils"

interface AffiliateData {
  affiliate: {
    id: string
    code: string
    commissionRate: number
    totalEarned: number
    totalWithdrawn: number
    availableBalance: number
    isActive: boolean
    createdAt: string
  }
  stats: {
    totalReferrals: number
    activeReferrals: number
    pendingCommissions: number
  }
  referrals: Array<{
    id: string
    user: {
      id: string
      name: string | null
      email: string
    }
    commission: number
    status: string
    orderId: string | null
    createdAt: string
    paidAt: string | null
  }>
}

interface WithdrawalData {
  id: string
  amount: number
  bankName: string
  bankAccount: string
  bankHolder: string
  status: string
  note: string | null
  rejectedReason: string | null
  createdAt: string
  approvedAt: string | null
}

export default function AffiliatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [withdrawals, setWithdrawals] = useState<WithdrawalData[]>([])
  const [showWithdrawForm, setShowWithdrawForm] = useState(false)
  const [withdrawForm, setWithdrawForm] = useState({
    amount: "",
    bankName: "",
    bankAccount: "",
    bankHolder: "",
    note: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [affiliateRes, withdrawalsRes] = await Promise.all([
        fetch("/api/affiliate/stats"),
        fetch("/api/affiliate/withdraw"),
      ])

      if (affiliateRes.ok) {
        const data = await affiliateRes.json()
        setAffiliate(data)
      }

      if (withdrawalsRes.ok) {
        const data = await withdrawalsRes.json()
        setWithdrawals(data)
      }
    } catch (error) {
      console.error("Fetch error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    try {
      setRegistering(true)
      const res = await fetch("/api/affiliate/register", {
        method: "POST",
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Có lỗi xảy ra")
        return
      }

      await fetchData()
    } catch (error) {
      console.error("Register error:", error)
      alert("Có lỗi xảy ra")
    } finally {
      setRegistering(false)
    }
  }

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const res = await fetch("/api/affiliate/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(withdrawForm.amount),
          bankName: withdrawForm.bankName,
          bankAccount: withdrawForm.bankAccount,
          bankHolder: withdrawForm.bankHolder,
          note: withdrawForm.note,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || "Có lỗi xảy ra")
        return
      }

      alert("Yêu cầu rút tiền đã được gửi!")
      setShowWithdrawForm(false)
      setWithdrawForm({
        amount: "",
        bankName: "",
        bankAccount: "",
        bankHolder: "",
        note: "",
      })
      await fetchData()
    } catch (error) {
      console.error("Withdraw error:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const copyReferralLink = () => {
    if (affiliate) {
      const link = `${window.location.origin}/register?ref=${affiliate.affiliate.code}`
      navigator.clipboard.writeText(link)
      alert("Đã sao chép link giới thiệu!")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Chương trình Đại lý</h1>
          <p className="text-gray-600 mb-8">
            Kiếm tiền bằng cách giới thiệu khách hàng mới. Nhận hoa hồng 10% từ mỗi đơn hàng của người bạn giới thiệu!
          </p>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {registering ? "Đang xử lý..." : "Đăng ký làm đại lý"}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard Đại lý</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Tổng thu nhập</p>
          <p className="text-2xl font-bold text-green-600">
            {format.currency(affiliate.affiliate.totalEarned)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Đã rút</p>
          <p className="text-2xl font-bold text-gray-900">
            {format.currency(affiliate.affiliate.totalWithdrawn)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Có thể rút</p>
          <p className="text-2xl font-bold text-blue-600">
            {format.currency(affiliate.affiliate.availableBalance)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Người giới thiệu</p>
          <p className="text-2xl font-bold text-gray-900">
            {affiliate.stats.totalReferrals}
          </p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Link giới thiệu của bạn</h2>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${typeof window !== "undefined" ? window.location.origin : ""}/register?ref=${affiliate.affiliate.code}`}
            className="flex-1 px-4 py-2 border rounded-lg bg-gray-50"
          />
          <button
            onClick={copyReferralLink}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sao chép
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Mã giới thiệu: <span className="font-bold">{affiliate.affiliate.code}</span> | Hoa hồng: {affiliate.affiliate.commissionRate}%
        </p>
      </div>

      {/* Withdraw Button */}
      <button
        onClick={() => setShowWithdrawForm(!showWithdrawForm)}
        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Rút tiền
      </button>

      {/* Withdraw Form */}
      {showWithdrawForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Yêu cầu rút tiền</h2>
          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Số tiền rút (VNĐ)</label>
              <input
                type="number"
                required
                min="100000"
                max={affiliate.affiliate.availableBalance}
                value={withdrawForm.amount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Tối thiểu 100,000 VNĐ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ngân hàng</label>
              <input
                type="text"
                required
                value={withdrawForm.bankName}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, bankName: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="VD: Vietcombank"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số tài khoản</label>
              <input
                type="text"
                required
                value={withdrawForm.bankAccount}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, bankAccount: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Chủ tài khoản</label>
              <input
                type="text"
                required
                value={withdrawForm.bankHolder}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, bankHolder: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
              <textarea
                value={withdrawForm.note}
                onChange={(e) => setWithdrawForm({ ...withdrawForm, note: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Xác nhận rút tiền
              </button>
              <button
                type="button"
                onClick={() => setShowWithdrawForm(false)}
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Withdrawals History */}
      {withdrawals.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Lịch sử rút tiền</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Ngày</th>
                  <th className="text-right py-3">Số tiền</th>
                  <th className="text-center py-3">Ngân hàng</th>
                  <th className="text-center py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((w) => (
                  <tr key={w.id} className="border-b">
                    <td className="py-3">{format.date(w.createdAt)}</td>
                    <td className="text-right">{format.currency(w.amount)}</td>
                    <td className="text-center">
                      {w.bankName}<br />
                      <span className="text-sm text-gray-600">{w.bankAccount}</span>
                    </td>
                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          w.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : w.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {w.status === "COMPLETED"
                          ? "Đã chuyển"
                          : w.status === "PENDING"
                          ? "Đang xử lý"
                          : "Đã hủy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Referrals List */}
      {affiliate.referrals.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Người giới thiệu ({affiliate.referrals.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3">Email</th>
                  <th className="text-right py-3">Hoa hồng</th>
                  <th className="text-center py-3">Trạng thái</th>
                  <th className="text-center py-3">Ngày</th>
                </tr>
              </thead>
              <tbody>
                {affiliate.referrals.map((r) => (
                  <tr key={r.id} className="border-b">
                    <td className="py-3">
                      {r.user.name || r.user.email}
                      <br />
                      <span className="text-sm text-gray-600">{r.user.email}</span>
                    </td>
                    <td className="text-right text-green-600 font-semibold">
                      {format.currency(r.commission)}
                    </td>
                    <td className="text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          r.status === "PAID"
                            ? "bg-green-100 text-green-800"
                            : r.status === "APPROVED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status === "PAID"
                          ? "Đã trả"
                          : r.status === "APPROVED"
                          ? "Đã duyệt"
                          : "Chờ duyệt"}
                      </span>
                    </td>
                    <td className="text-center text-sm text-gray-600">
                      {format.date(r.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
