'use client'

import { useTheme } from 'next-themes'

export default function ThemeButton() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => {
        setTheme(theme === 'light' ? 'dark' : 'light')
      }}
      className="cursor-pointer"
    >
      切换主题
    </button>
  )
}
