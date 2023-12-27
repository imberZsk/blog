import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const post = await req.json()
  const res = await prisma.user.create({ data: post })
  return Response.json(res)
}

// try catch
