import { mergeAttributes, Node } from '@tiptap/core'
// @ts-ignore
import { TextSelection, NodeSelection } from '@tiptap/pm/state'

type VoteItem = {
  title: string
}

type VoteProps = {
  title: string
  items: VoteItem[]
}

type ItemData = [
  string,
  {
    class: string
  },
  string // 这里假设你的文本内容都是字符串类型
]

declare module '@tiptap/core' {
  // eslint-disable-next-line no-unused-vars
  interface Commands<ReturnType> {
    vote: {
      /**
       * Select text between node boundaries
       */
      // eslint-disable-next-line no-unused-vars
      setVote: (props: VoteProps) => ReturnType
    }
  }
}

const Vote = Node.create({
  name: 'vote',
  group: 'block',
  content: 'text*',

  // 默认是100，优先权高会先加载
  // priority: 100,

  // 设置，可以设置元素属性
  addOptions() {
    return {
      HTMLAttributes: {},
      voteList: {}
    }
  },

  // 允许内容是否能包装段落，多个段落
  // content: 'paragraph+',

  // 数组中的第一个值应该是 HTML 标记的名称。如果第二个元素是对象，则将其解释为一组属性。之后的任何元素都将呈现为子元素。
  renderHTML({ HTMLAttributes }) {
    let list: ItemData[] = []

    const title = this.options.voteList.title

    const items = this.options.voteList.items

    items.forEach((item: VoteItem) => {
      list.push([
        'div',
        {
          class:
            'h-[40px] bg-white rounded-[4px] my-[12px] leading-[40px] indent-[16px] text-[14px] text-black font-medium'
        },
        item.title
      ])
    })

    return [
      'div',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      ['div', { class: 'text-black text-[16px] font-bold' }, title],
      ['div', {}, ...list],
      ['div', { class: 'text-black text-[16px] font-bold' }, '已有0人参加还有1天结束'],
      ['div', { class: 'text-black text-[16px] font-bold' }, '投票']
    ]
  },

  // 从div标签尝试去解析成vote
  parseHTML() {
    return [{ tag: 'div' }]
  },

  addCommands() {
    return {
      setVote:
        (props: VoteProps) =>
        ({ chain, state }) => {
          this.options.voteList = props

          const { $to: $originTo } = state.selection // 获取当前光标位置信息

          const currentChain = chain() // 创建一个新的命令链

          // 检查光标是否在文档的开头
          if ($originTo.parentOffset === 0) {
            // 如果是，将分割线插入到文档开头的前两个位置
            currentChain.insertContentAt(Math.max($originTo.pos - 2, 0), {
              type: this.name,
              content: [{ type: 'text', text: '666' }]
            })
          } else {
            // 如果不是，在光标处插入分割线
            currentChain.insertContent({
              type: this.name,
              content: [{ type: 'text', text: '666' }]
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

export default Vote
