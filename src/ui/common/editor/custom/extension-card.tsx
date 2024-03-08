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
  // content: 'text*',

  addOptions() {
    return {
      HTMLAttributes: {},
      cardData: {}
    }
  },

  group: 'block', //重要，否则可能不渲染

  parseHTML() {
    return [{ tag: 'div' }]
  },

  renderHTML({ HTMLAttributes }) {
    const { title } = this.options.cardData
    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['div', { class: 'text-[16px] font-bold text-[#ff4132]' }, title]
    ]
  },

  addCommands() {
    return {
      setCard:
        (props: CardProps) =>
        ({ chain, state }) => {
          // tr => {
          // const chain = tr.chain
          // const state = tr.state
          this.options.cardData = props

          const currentChain = chain() // 创建一个新的命令链

          const { $to: $originTo } = state.selection

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
              // set cursor after horizontal rule
              .command(({ tr, dispatch }) => {
                if (dispatch) {
                  const { $to } = tr.selection
                  const posAfter = $to.end()
                  if ($to.nodeAfter) {
                    if ($to.nodeAfter.isTextblock) {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos + 1))
                    } else if ($to.nodeAfter.isBlock) {
                      tr.setSelection(NodeSelection.create(tr.doc, $to.pos))
                    } else {
                      tr.setSelection(TextSelection.create(tr.doc, $to.pos))
                    }
                  } else {
                    const node = $to.parent.type.contentMatch.defaultType?.create()
                    if (node) {
                      tr.insert(posAfter, node)
                      tr.setSelection(TextSelection.create(tr.doc, posAfter))
                    }
                  }
                  tr.scrollIntoView()
                }

                return true
              })
              .run()
          )
        }
    }
  }
})

export default Card
