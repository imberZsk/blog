import type { Metadata } from 'next'
import '@/app/globals.css'
import Nav from '@/ui/foreground/nav'

export const metadata: Metadata = {
  title: 'foreground ｜ imber docs'
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Nav></Nav>
      {children}
    </main>
  )
}
