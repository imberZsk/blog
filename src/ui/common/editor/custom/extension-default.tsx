import StarterKit from '@tiptap/starter-kit'
import TiptapUnderline from '@tiptap/extension-underline'
import Image from '@tiptap/extension-image'
import BubbleMenu from '@tiptap/extension-bubble-menu'
import Vote from './extension-vote'
import Card from './extension-card'

export const defaultExtensions = [
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: {
        class: 'border-l-4 border-stone-700'
      }
    },
    bold: {
      HTMLAttributes: {
        class: 'font-bold'
      }
    },
    heading: {
      levels: [1, 2, 3]
    },
    horizontalRule: {
      HTMLAttributes: {
        class: 'my-[20px]'
      }
    }
  }),
  TiptapUnderline,
  Image,
  Vote.configure({
    HTMLAttributes: {
      class: 'p-[20px] bg-[#ccc] rounded-[8px] w-full bg-[#ccc] my-[10px]'
    }
  }),
  Card.configure({
    HTMLAttributes: {
      class: 'w-[708px] h-[40px] border border-[#ff4132]'
    }
  }),
  BubbleMenu.configure({
    // element: document.querySelector('.menu') as HTMLElement
  })
  // FileHandler.configure({
  //   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
  //   onDrop: (currentEditor, files, pos) => {
  //     files.forEach(file => {
  //       const fileReader = new FileReader()

  //       fileReader.readAsDataURL(file)
  //       fileReader.onload = () => {
  //         currentEditor
  //           .chain()
  //           .insertContentAt(pos, {
  //             type: 'image',
  //             attrs: {
  //               src: fileReader.result
  //             }
  //           })
  //           .focus()
  //           .run()
  //       }
  //     })
  //   },
  //   onPaste: (currentEditor, files, htmlContent) => {
  //     files.forEach(file => {
  //       if (htmlContent) {
  //         // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
  //         // you could extract the pasted file from this url string and upload it to a server for example
  //         //如果有htmlContent，停止手动插入，让其他扩展通过inputRule处理插入
  //         //您可以从这个url字符串中提取粘贴的文件并将其上传到服务器
  //         console.log(htmlContent) // eslint-disable-line no-console
  //         return false
  //       }

  //       const fileReader = new FileReader()

  //       fileReader.readAsDataURL(file)
  //       fileReader.onload = () => {
  //         currentEditor
  //           .chain()
  //           .insertContentAt(currentEditor.state.selection.anchor, {
  //             type: 'image',
  //             attrs: {
  //               src: fileReader.result
  //             }
  //           })
  //           .focus()
  //           .run()
  //       }
  //     })
  //   }
  // })
]
