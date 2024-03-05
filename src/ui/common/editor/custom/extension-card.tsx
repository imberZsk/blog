import { Node, mergeAttributes } from '@tiptap/core'
// @ts-ignore
import { TextSelection, NodeSelection } from '@tiptap/pm/state'

type CardProps = {
  title: string
  subTitle: string
  price: string
  img: string
}

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    card: {
      /**
       * Select text between node boundaries
       */
      // eslint-disable-next-line no-unused-vars
      setCard: (props: CardProps) => ReturnType
    }
  }
}

const Card = Node.create({
  name: 'card',
  group: 'block', //重要，否则可能不渲染
  content: 'text*',

  addOptions() {
    return {
      HTMLAttributes: {},
      cardData: {}
    }
  },

  renderHTML({ HTMLAttributes }) {
    const { title } = this.options.cardData
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['div', { class: 'text-[16px] font-bold text-[#ff4132]' }, title]
    ]
  },

  parseHTML() {
    return [{ tag: 'div' }]
  },

  addCommands() {
    return {
      setCard:
        (props: CardProps) =>
        ({ chain, state }) => {
          this.options.cardData = props
          const { $to: $originTo } = state.selection // 获取当前光标位置信息

          const currentChain = chain() // 创建一个新的命令链

          // 检查光标是否在文档的开头
          if ($originTo.parentOffset === 0) {
            // 如果是，将分割线插入到文档开头的前两个位置
            currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), {
              type: this.name
            })
          } else {
            // 如果不是，在光标处插入分割线
            currentChain.insertContent({
              type: this.name
            })
          }

          return (
            currentChain
              // 在分割线完成后，使用command函数设置光标位置
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection
                  const posAfter = $to.end()
                  // 如果光标后面有节点，则将光标放置在该节点之前
                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                    }
                  } else {
                    // 如果光标后面没有节点，则在文档末尾添加一个新节点，并将光标放置在该节点之后
                    const node = $to.parent.type.contentMatch.defaultType?.create()

                    if (node) {
                      tr.insert(posAfter, node)
                      tr.setSelection(TextSelection.create(tr.doc, posAfter + 1))
                    }
                  }

                  tr.scrollIntoView() // 滚动到光标位置
                }

                return true
              })
              .run() // 运行整个命令链，将所有更改应用到编辑器中
          )
        }
    }
  }
})

export default Card
