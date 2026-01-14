import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://taphoammoi.com'),
  title: {
    default: "Tạp Hóa MMO Mới - Sàn Mua Bán Tài Nguyên MMO Tự Động & Uy Tín Số 1 VN",
    template: "%s | Tạp Hóa MMO Mới"
  },
  description: "Taphoammoi.com là sàn giao dịch tài nguyên MMO tự động 24/7 uy tín, thay thế hoàn hảo cho các chợ MMO cũ. Kho Via Facebook, Clone, Gmail, Proxy, BM, Hotmail chất lượng cao. Nạp tiền tự động, bảo hành 1-1, thanh toán siêu tốc.",
  keywords: ["tạp hóa mmo", "taphoammo", "mua bán via", "mua gmail cổ", "thuê proxy", "tài nguyên mmo", "chợ mmo", "sàn mmo", "taphoammoi", "via facebook xmdt", "bm facebook"],
  authors: [{ name: "Tạp Hóa MMO Mới" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://taphoammoi.com/",
    siteName: "Tạp Hóa MMO Mới",
    title: "Tạp Hóa MMO Mới - Kho Tài Nguyên MMO Giá Rẻ & Tự Động",
    description: "Hệ thống cung cấp Via, Gmail, Proxy, Tool MMO số lượng lớn. Nạp tiền tự động, bảo hành uy tín. Truy cập ngay!",
    images: [
      {
        url: "https://taphoammoi.com/images/banner-share-social.jpg",
        width: 1200,
        height: 630,
        alt: "Tạp Hóa MMO Mới"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tạp Hóa MMO Mới - Sàn Giao Dịch MMO Tự Động",
    description: "Mua bán Via, Clone, Mail, Proxy tự động 24/7. Giá rẻ, an toàn, bảo mật.",
    images: ["https://taphoammoi.com/images/banner-share-social.jpg"],
  },
  alternates: {
    canonical: "https://taphoammoi.com/",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://taphoammoi.com/#website",
      "url": "https://taphoammoi.com/",
      "name": "Tạp Hóa MMO Mới",
      "description": "Sàn Mua Bán Tài Nguyên MMO Tự Động & Uy Tín",
      "publisher": {
        "@id": "https://taphoammoi.com/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://taphoammoi.com/tim-kiem?q={search_term_string}",
        "query-input": "required name=search_term_string"
      },
      "inLanguage": "vi-VN"
    },
    {
      "@type": "OnlineStore",
      "@id": "https://taphoammoi.com/#organization",
      "name": "Tạp Hóa MMO Mới",
      "url": "https://taphoammoi.com/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://taphoammoi.com/logo.png",
        "width": 112,
        "height": 112
      },
      "image": {
        "@type": "ImageObject",
        "url": "https://taphoammoi.com/images/banner-share-social.jpg",
        "width": 1200,
        "height": 630
      },
      "description": "Nền tảng thương mại điện tử chuyên cung cấp tài nguyên MMO (Make Money Online) như Via Facebook, Gmail, Proxy, Phần mềm marketing với hệ thống giao dịch tự động 24/7.",
      "email": "admin@taphoammoi.com",
      "priceRange": "$",
      "paymentAccepted": [
        "Chuyển khoản ngân hàng",
        "Momo",
        "USDT"
      ],
      "sameAs": [
        "https://www.facebook.com/taphoammoi",
        "https://t.me/taphoammoi"
      ]
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <Script
          id="schema-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Toaster />
      </body>
    </html>
  )
}
