import type { Metadata } from 'next'
import '@/app/globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '%s | imber docs',
  description: 'imber docs',
  keywords: 'imber,docs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="text-gray-700 dark:text-gray-200">
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>{children}</Providers>
      </body>
    </html>
  )
}
