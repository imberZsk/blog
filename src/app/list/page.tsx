import Itemes from '@/ui/list/items'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function List() {
  const posts = await prisma.post.findMany()

  console.log(posts)
  return (
    <div>
      <Itemes posts={posts}></Itemes>
    </div>
  )
}
