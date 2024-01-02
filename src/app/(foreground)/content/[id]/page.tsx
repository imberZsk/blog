import EditorShow from '@/ui/common/editor/editor-show'
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
    <div className="mx-auto w-[690px]">
      <h1 className="p-[20px] text-2xl font-bold">{res.title}</h1>
      <EditorShow editable={false} content={res.content}></EditorShow>
    </div>
  )
}

export default Page
