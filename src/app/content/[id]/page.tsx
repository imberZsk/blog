import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const res = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!res) return null

  return (
    <div>
      <div>{res.title} </div>
      <div>{res.content}</div>
    </div>
  )
}

export default Page
