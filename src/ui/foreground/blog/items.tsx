'use client'

import Link from 'next/link'

type Post = {
  id: number
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  userId: number
}[]

export default function Items({ posts }: { posts: Post }) {
  return (
    <div className="flex flex-col">
      {posts.map((item, index) => {
        return (
          <Link
            key={index}
            href={`/content/${item.id}`}
            className="my-[10px] transition-colors hover:text-[#000] dark:hover:text-[#fff]"
          >
            {item.title}
          </Link>
        )
      })}
    </div>
  )
}
