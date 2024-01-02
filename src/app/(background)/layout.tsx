import type { Metadata } from 'next'
import '@/app/globals.css'

export const metadata: Metadata = {
  title: 'background ｜ imber docs'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}
