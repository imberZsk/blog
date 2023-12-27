import Link from 'next/link'

export default function Dashboard() {
  return (
    <div>
      <Link href="/dance" className="text-black">
        dance
      </Link>
      <Link href="/login" className="text-black">
        去登陆注册
      </Link>
      首页
    </div>
  )
}
