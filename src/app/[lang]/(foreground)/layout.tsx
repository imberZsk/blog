import type { Metadata } from 'next'
import '@/app/globals.css'
import Nav from '@/ui/foreground/nav'
import { Locale } from '../../../../i18n-config'

export const metadata: Metadata = {
  title: 'foreground ｜ imber docs'
}

export default function Layout({ children, params }: { children: React.ReactNode; params: { lang: Locale } }) {
  return (
    <main>
      <Nav params={params}></Nav>
      {children}
    </main>
  )
}
