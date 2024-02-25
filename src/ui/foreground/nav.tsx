import { getDictionary } from '../../../get-dictionary'
import { Locale } from '../../../i18n-config'
import LocaleSwitcher from './locale-switcher'
import ThemeButton from '../common/theme-button'
import Link from 'next/link'

export default async function Nav({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang)

  return (
    <nav className="flex items-center justify-between px-[48px] py-[32px]">
      <Link href={'/'}>imber</Link>
      <div className="flex items-center gap-4">
        {dictionary.tabs.map((item, index) => {
          return (
            <Link href={item.href} key={index} target={item.target}>
              {item.name}
            </Link>
          )
        })}
        <ThemeButton></ThemeButton>
        <div className="cursor-pointer">
          <LocaleSwitcher></LocaleSwitcher>
        </div>
        <Link className="h-[30px] w-[30px] rounded-full bg-[#000000] dark:bg-[#ffffff]" href={'login'}></Link>
      </div>
    </nav>
  )
}
