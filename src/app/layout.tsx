import type { Metadata } from 'next'
import '@/app/globals.css'
import { Providers } from './providers'
// import { ThemeProvider } from '@/ui/common/theme-provider'

export const metadata: Metadata = {
  title: '%s | imber docs',
  description: 'imber docs',
  keywords: 'imber,docs'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="text-gray-700 dark:text-gray-200">
        {/* <ThemeProvider attribute="class" defaultTheme="dark"> */}
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>{children}</Providers>
        {/* </ThemeProvider> */}
      </body>
    </html>
  )
}
