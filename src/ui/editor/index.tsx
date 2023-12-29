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

  const [isShow, setIsShow] = useState(false)

  const editor = useEditor({
    extensions: [...defaultExtensions],
    content: '<p>Hello World! </p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
      }
    }
  })

  // 上传图片
  const addImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      if (input.files?.length) {
        const reader = new FileReader()
        reader.readAsDataURL(input.files[0])
        reader.onloadend = function (e) {
          editor
            ?.chain()
            .focus()
            .setImage({
              src: e.target?.result as string
            })
            .run()
        }
      }
    }
    input.click()
  }

  // @
  const mention = () => {
    setIsShow(true)
  }

  if (!editor) return null

  return (
    <div className="mx-auto mt-[80px] w-[1200px]">
      <h1 className="mb-[40px] text-center text-[60px]">编辑器开发中</h1>
      <div className="mb-[80px] flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          italic(⌘ + I)
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          bold(⌘ + B)
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          h1(⌘ + option + 1)
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'is-active' : ''}
        >
          underline(⌘ + U)
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          strike(⌘ + ⇧ + S)
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={!editor.can().chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          blockquote引用
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule分割线</button>
        <button onClick={addImage}>上传图片</button>
        <button onClick={mention}>提及@</button>
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

          console.log(curData)
          // fetch('/api/editor/create', {
          //   method: 'POST',
          //   body: JSON.stringify(curData)
          // })
          //   .then(res => res.json())
          //   .then(res => console.log(res, 'res'))
        }}
      >
        发布
      </button>

      {isShow && (
        <div
          className={`flex-center opacity-1 visible} absolute left-0 top-0 z-[999] flex h-screen w-screen items-center justify-center bg-[rgba(0,0,0,0.5)]`}
        >
          <div className="md425:w-[432px] md425:p-[32px_24px_24px_24px] z-[1000] w-[600px] rounded-[8px] bg-[rgba(255,255,255,0.97)] p-[24px] shadow-[0px_12px_48px_1px_rgba(0,0,0,0.2)] dark:bg-[rgba(54,58,64,0.8)] dark:backdrop-blur-lg">
            {/* 标题 */}
            <h2 className="text-center text-[18px] font-bold leading-[32px] text-[#2D3748] dark:text-[#ffffff]">
              标题
            </h2>

            {/* 内容 */}
            <div className="flex flex-col gap-4 py-[16px] text-center">
              <button
                className="cursor-pointer text-[#ff4132] dark:text-[#e65045]"
                onClick={() => {
                  setIsShow(false)
                  // 也可以插入一段span
                  editor.commands.insertContent('@ikun1号')
                }}
              >
                @ikun1号
              </button>
              <button
                className="cursor-pointer text-[#ff4132] dark:text-[#e65045]"
                onClick={() => {
                  setIsShow(false)
                  editor.commands.insertContent('@ikun2号')
                }}
              >
                @ikun2号
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Editor
