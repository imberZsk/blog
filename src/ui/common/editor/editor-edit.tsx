/* eslint-disable no-unused-vars */
// @ts-nocheck

'use client'

import { useState } from 'react'
import { defaultExtensions } from './extensions'
import { useEditor, EditorContent } from '@tiptap/react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input
} from '@nextui-org/react'

const EditorEdit = () => {
  const [data, setData] = useState({
    userId: 2,
    title: '',
    content: ''
  })

  const [voteData, setVoteData] = useState({
    title: '',
    items: [
      {
        title: ''
      },
      {
        title: ''
      }
    ]
  })

  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  const [isShowMention, setIsShowMention] = useState(false)

  const editor = useEditor({
    editable: true,
    extensions: [...defaultExtensions],
    content: '<p>来编写你的文章吧～</p>',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl py-5 focus:outline-none'
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
    setIsShowMention(true)
  }

  const [stream, setStream] = useState('666')

  if (!editor) return null

  //
  const handleAI1 = () => {
    // fetch(`/api/ai/document`).then(res => {
    //   console.log(res)
    // })
    // const eventSource = new EventSource('/api/ai/document')

    // eventSource.onmessage = function (event) {
    //   const data = JSON.parse(event.data)
    //   console.log(data)
    //   // 在这里处理接收到的数据
    // }
    const url = '/api/ai/document' // 将 "/api/your-endpoint" 替换为你的 API 路由路径

    fetch(url)
      .then(response => {
        const reader = response.body.getReader()

        function read() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              console.log('Stream complete')
              return
            }

            const chunk = new TextDecoder().decode(value)
            console.log('Received chunk:', chunk)
            setStream(stream => (stream += chunk))
            // 在这里处理接收到的数据

            return read() // 继续读取下一个数据块
          })
        }

        return read()
      })
      .catch(error => {
        console.error('Error receiving stream:', error)
      })
  }

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
        <button
          onClick={() => {
            console.log(editor.getJSON())
          }}
        >
          获取编辑器数据
        </button>
        <button
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
          发布文章
        </button>
      </div>

      <div className="mb-[80px] flex gap-2">
        <button onClick={onOpen} className="outline-none">
          投票（新Nodes）
        </button>
      </div>

      <div className="cursor-pointer" onClick={handleAI1}>
        AI-根据关键词生成朋友圈文案（轻帖）
      </div>
      <div>AI-根据关键词生成小红书文案（轻帖）</div>
      <div>AI-扩写助手</div>
      <div>AI-润色</div>
      <div>{stream}</div>

      <div className="mx-auto w-[708px]">
        {/* <input
          type="text"
          className="bg-none text-[40px] font-bold outline-none"
          placeholder="文章标题"
          onChange={e => {
            setData({
              ...data,
              title: e.target.value
            })
          }}
        /> */}

        {/* TODO:怎么获取数据 */}
        <div className="h-[70px]">
          <div
            contentEditable={true}
            className="m-0 h-full whitespace-pre-wrap break-all text-[40px] outline-none"
            spellCheck="true"
          ></div>
        </div>
        <EditorContent editor={editor} className="editorContent" />
      </div>

      {/* 提及 */}
      {isShowMention && (
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
                  setIsShowMention(false)
                  // 也可以插入一段span
                  editor.commands.insertContent('@ikun1号')
                }}
              >
                @ikun1号
              </button>
              <button
                className="cursor-pointer text-[#ff4132] dark:text-[#e65045]"
                onClick={() => {
                  setIsShowMention(false)
                  editor.commands.insertContent('@ikun2号')
                }}
              >
                @ikun2号
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 投票 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">创建投票</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  endContent={<div className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />}
                  placeholder="填写投票标题"
                  variant="bordered"
                  onChange={e => {
                    setVoteData({ ...voteData, title: e.target.value })
                  }}
                />
                <Input
                  autoFocus
                  endContent={<div className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />}
                  label="选项1"
                  placeholder="填写投票选项"
                  variant="bordered"
                  onChange={e => {
                    setVoteData({
                      ...voteData,
                      items: [{ title: e.target.value }, { title: voteData.items[1].title }]
                    })
                  }}
                />
                <Input
                  endContent={<div className="pointer-events-none flex-shrink-0 text-2xl text-default-400" />}
                  label="选项2"
                  placeholder="填写投票选项"
                  variant="bordered"
                  onChange={e => {
                    setVoteData({
                      ...voteData,
                      items: [{ title: voteData.items[0].title }, { title: e.target.value }]
                    })
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  取消
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    editor.commands.setVote(voteData)
                    onClose()
                  }}
                >
                  创建
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  )
}

export default EditorEdit
