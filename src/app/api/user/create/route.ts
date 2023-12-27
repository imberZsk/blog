import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const user = await req.json()
  const res = await prisma.user.create({ data: user })
  return Response.json(res)
}

// try catch
