import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const data = await req.json()
  console.log(data)
  const id = data.id

  const res = await prisma.user.update({
    where: {
      id: id
    },
    data: data
  })
  return Response.json(res)
}
