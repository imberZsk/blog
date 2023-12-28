'use client'

import { useState } from 'react'
import { defaultExtensions } from './extensions'
import { useEditor, EditorContent } from '@tiptap/react'

const Editor = () => {
  const [data, setData] = useState({
    userId: 2,
    title: '',
    content: ''
  })

  const editor = useEditor({
    extensions: [...defaultExtensions],
    content: '<p>Hello World! </p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
      }
    }
  })

  if (!editor) return null

  return (
    <div className="mx-auto mt-[80px] w-[1200px]">
      <div className="mb-[80px] flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
        >
          underline
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</button>
        <div
          onClick={() => {
            console.log(editor.getJSON())
          }}
        >
          test
        </div>
      </div>

      <input
        type="text"
        placeholder="文章标题"
        onChange={e => {
          setData({
            ...data,
            title: e.target.value
          })
        }}
      />

      <EditorContent editor={editor} className="editorContent" />

      <button
        className="rounded-[4px] bg-pink-200 p-[4px]"
        onClick={() => {
          const curData = {
            ...data,
            content: JSON.stringify(editor.getJSON().content)
          }

          fetch('/api/editor/create', {
            method: 'POST',
            body: JSON.stringify(curData)
          })
            .then(res => res.json())
            .then(res => console.log(res, 'res'))
        }}
      >
        发布
      </button>
    </div>
  )
}

export default Editor
