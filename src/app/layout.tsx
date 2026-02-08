import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? "掲示板";

export const metadata: Metadata = {
  title: siteName,
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION ?? "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-blue-600 hover:text-blue-700">
              {siteName}
            </Link>
            <nav className="flex gap-4">
              <Link href="/" className="text-sm text-gray-600 hover:text-blue-600">
                ホーム
              </Link>
              <Link href="/notes" className="text-sm text-gray-600 hover:text-blue-600">
                書き込み一覧
              </Link>
              <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                お問い合わせ
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
