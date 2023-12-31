import Link from 'next/link'
import ThemeButton from './theme-button'

export default function Nav() {
  return (
    <nav className="flex justify-between px-[48px] py-[32px]">
      <Link href={'/'}>imber</Link>
      <div className="flex gap-4">
        <Link href={'/blog'}>Blog</Link>
        <ThemeButton></ThemeButton>
      </div>
    </nav>
  )
}
