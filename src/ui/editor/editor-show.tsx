'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import { defaultExtensions } from './extensions'

const Editor = ({ editable = true, content = '来编写你的文章吧～' }: { editable?: boolean; content?: string }) => {
  const editor = useEditor({
    editable: editable,
    extensions: [...defaultExtensions],
    content: {
      type: 'doc',
      content: JSON.parse(content)
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
      }
    }
  })

  return <EditorContent editor={editor} className="editorContent" />
}

export default Editor
