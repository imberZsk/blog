import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function POST(req: Request) {
  const post = await req.json()
  const res = await prisma.post.create({ data: post })
  return Response.json(res)
}

// try catch
