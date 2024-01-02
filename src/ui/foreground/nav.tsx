import ThemeButton from '../common/theme-button'
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex justify-between px-[48px] py-[32px]">
      <Link href={'/'}>imber</Link>
      <div className="flex gap-4">
        <Link href={'/blog'}>Blog</Link>
        <a href="https://imber-docs.netlify.app" target="_blank">
          Docs
        </a>
        <ThemeButton></ThemeButton>
      </div>
    </nav>
  )
}
