'use client'

import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useState, useRef } from 'react'
import { defaultExtensions } from './custom/extension-default'
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react'
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
import CryptoJS from 'crypto-js'
import Typed from 'typed.js'

const EditorEdit = () => {
  const el1 = useRef(null)
  const el2 = useRef(null)
  const el3 = useRef(null)
  const el4 = useRef(null)
  const typed = useRef<Typed | null>(null)

  const [aiData, setAiData] = useState('')

  // eslint-disable-next-line no-unused-vars
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

  if (!editor) return null

  const handleAI1 = async () => {
    const url = `/api-myplus/myplus-qing/ug/ai/gc/document/friend?text=${encodeURIComponent('魅族')}`
    let tar = ''
    await fetchEventSource(url, {
      method: 'POST',
      onmessage(ev) {
        const encodedData = ev.data // Base64 编码的字符串
        // 解密 Base64 数据
        const decodedData = CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8)
        // setStr(str => (str += decodedData))
        tar += decodedData
      }
    })
    if (typed.current) {
      typed.current?.destroy()
    }
    typed.current = new Typed(el1.current, {
      strings: [tar],
      typeSpeed: 50
    })
    setAiData(tar)
    typed.current.start()
  }

  const handleAI2 = async () => {
    const url = `/api-myplus/myplus-qing/ug/ai/gc/document/red?text=${encodeURIComponent('魅族手机')}`
    let tar = ''
    await fetchEventSource(url, {
      method: 'POST',
      onmessage(ev) {
        const encodedData = ev.data // Base64 编码的字符串
        // 解密 Base64 数据
        const decodedData = CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8)
        // setStr(str => (str += decodedData))
        tar += decodedData
      }
    })
    if (typed.current) {
      typed.current?.destroy()
    }
    typed.current = new Typed(el2.current, {
      strings: [tar],
      typeSpeed: 50
    })
    setAiData(tar)
    typed.current.start()
  }

  const handleAI3 = async () => {
    const url = `/api-myplus/myplus-qing/ug/ai/gc/expand?text=${encodeURIComponent('今天天气真好')}`
    let tar = ''
    await fetchEventSource(url, {
      method: 'POST',
      onmessage(ev) {
        const encodedData = ev.data // Base64 编码的字符串
        // 解密 Base64 数据
        const decodedData = CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8)
        // setStr(str => (str += decodedData))
        tar += decodedData
      }
    })
    if (typed.current) {
      typed.current?.destroy()
    }
    typed.current = new Typed(el3.current, {
      strings: [tar],
      typeSpeed: 50
    })
    setAiData(tar)
    typed.current.start()
  }

  const handleAI4 = async () => {
    const url = `/api-myplus/myplus-qing/ug/ai/gc/polish?text=${encodeURIComponent('今天天气真好')}`
    let tar = ''
    await fetchEventSource(url, {
      method: 'POST',
      onmessage(ev) {
        const encodedData = ev.data // Base64 编码的字符串
        // 解密 Base64 数据
        const decodedData = CryptoJS.enc.Base64.parse(encodedData).toString(CryptoJS.enc.Utf8)
        // setStr(str => (str += decodedData))
        tar += decodedData
      }
    })
    if (typed.current) {
      typed.current?.destroy()
    }
    typed.current = new Typed(el4.current, {
      strings: [tar],
      typeSpeed: 50
    })
    setAiData(tar)
    typed.current.start()
  }

  return (
    <div className="mx-auto mt-[80px] w-[1200px]">
      <h1 className="mb-[40px] text-center text-[60px]">编辑器开发中</h1>

      <div className="type-wrap w-full">
        <span style={{ whiteSpace: 'wrap' }} ref={el1}></span>
      </div>

      <div className="type-wrap w-full">
        <span style={{ whiteSpace: 'wrap' }} ref={el2}></span>
      </div>

      <div className="type-wrap w-full">
        <span style={{ whiteSpace: 'wrap' }} ref={el3}></span>
      </div>

      <div className="type-wrap w-full">
        <span style={{ whiteSpace: 'wrap' }} ref={el4}></span>
      </div>

      <div
        onClick={() => {
          console.log(aiData, 'aidata')
          editor.commands.insertContent(aiData)
        }}
        className="cursor-pointer"
      >
        复制文案到编辑器中
      </div>

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
            // const curData = {
            //   ...data,
            //   content: JSON.stringify(editor.getJSON().content)
            // }
            // console.log(curData)

            // const content = JSON.parse(curData.content)

            function transformFields(input) {
              const transformed = input.map(item => ({
                t: item.type === 'paragraph' ? 'p' : item.type,
                c: item.content?.map(contentItem => {
                  const marks = contentItem.marks || []
                  const isBold = marks.some(mark => mark.type === 'bold')
                  const isItalic = marks.some(mark => mark.type === 'italic')

                  return {
                    x: contentItem.text,
                    ...(isBold ? { b: true } : {}),
                    ...(isItalic ? { l: true } : {})
                  }
                }) || [{ x: '' }]
              }))

              return transformed
            }

            console.log(transformFields(editor.getJSON().content))
            const target = JSON.stringify(transformFields(editor.getJSON().content))

            // 自己的接口
            // fetch('/api/editor/create', {
            //   method: 'POST',
            //   body: JSON.stringify(curData)
            // })
            //   .then(res => res.json())
            //   .then(res => console.log(res, 'res'))

            // 发布文章到社区

            fetch('/api-myplus/myplus-qing/u/content/auth/create/v4', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title: '111',
                ats: [],
                format: 2,
                forumId: 238,
                topicIds: '',
                content: target
              })
            })
              .then(res => res.json())
              .then(res => {
                window.open(`https://www.meizu.cn/thread/${res.data.id}`)
              })
          }}
        >
          发布文章
        </button>
      </div>

      <div className="mb-[80px] flex gap-2">
        <button onClick={onOpen} className="outline-none">
          投票(新Nodes - vote)
        </button>
        <button
          onClick={() =>
            editor.chain().focus().setCard({ title: 'title', subTitle: 'subTitle', price: '价格', img: '图片' }).run()
          }
          className="outline-none"
        >
          商品卡片(新Nodes - card)
        </button>

        <button
          onClick={() =>
            editor.chain().focus().setCard({ title: 'title', subTitle: 'subTitle', price: '价格', img: '图片' }).run()
          }
          className="outline-none"
        >
          emoji(新Nodes - emoji)
        </button>
      </div>

      <div className="cursor-pointer" onClick={handleAI1}>
        AI-根据关键词生成朋友圈文案（轻帖）
      </div>

      <div onClick={handleAI2}>AI-根据关键词生成小红书文案（轻帖）</div>
      <div onClick={handleAI3}>AI-扩写助手</div>
      <div onClick={handleAI4}>AI-润色</div>

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
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${editor.isActive('bold') ? 'is-active' : ''} mr-[20px]`}
          >
            bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`editor.isActive('italic') ? 'is-active' : '' mr-[20px]`}
          >
            italic
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive('strike') ? 'is-active' : ''}
          >
            strike
          </button>
        </BubbleMenu>
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
