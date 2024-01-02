import Items from '@/ui/list/items'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function List() {
  const posts = await prisma.post.findMany()

  return (
    <main>
      <div className="mx-auto w-[650px]">
        <h1 className="my-[32px] text-[32px]">Blogs</h1>
        <Items posts={posts}></Items>
      </div>
    </main>
  )
}
