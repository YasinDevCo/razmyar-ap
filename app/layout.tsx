import { Analytics } from '@vercel/analytics/next'
import { Vazirmatn } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import './globals.css'

const vazir = Vazirmatn({
  variable: '--font-vazir',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'رزمیار | سیستم مربیگری',
  description: 'سیستم هوشمند مدیریت باشگاه‌های رزمی و مسیر پیشرفت شاگردان',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b1828',
  width: 'device-width',
  initialScale: 1,
}

import { Providers } from './providers'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className="dark bg-background">
      <body className={`${vazir.variable} font-sans antialiased`}>
        <Providers>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </Providers>
      </body>
    </html>
  )
}
