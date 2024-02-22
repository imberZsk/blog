import ThemeButton from '../common/theme-button'
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex items-center justify-between px-[48px] py-[32px]">
      <Link href={'/'}>imber</Link>
      <div className="flex items-center gap-4">
        <Link href={'/virtual-list'}>虚拟列表</Link>
        <Link href={'/waterfall'}>瀑布流</Link>
        <a href="https://imber-docs.netlify.app" target="_blank">
          文档
        </a>
        <Link href={'/blog'}>博客</Link>
        <Link href={'/editor'} target="_blank">
          写文章
        </Link>
        <ThemeButton></ThemeButton>
        <div className="cursor-pointer">切换语言</div>
        <Link className="h-[30px] w-[30px] rounded-full bg-[#000000] dark:bg-[#ffffff]" href={'login'}></Link>
      </div>
    </nav>
  )
}
