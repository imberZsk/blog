import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function DELETE(req: Request) {
  const data = await req.json()
  const id = data.id
  await prisma.user.delete({
    where: {
      id: id
    }
  })
  return Response.json({ data: true })
}
