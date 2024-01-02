import { mergeAttributes, Node } from '@tiptap/core'

type VoteItem = {
  a: number
}

type VoteProps = {
  items: VoteItem[]
  time: number
}

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
  // 名字
  name: 'vote',

  // 默认是100，优先权高会先加载
  // priority: 100,

  // 设置，可以设置元素属性
  addOptions() {
    return {
      HTMLAttributes: {}
    }
  },

  group: 'block',

  // 允许内容是否能包装段落，vote不需要
  content: 'paragraph*',

  // 设置属性信息，可以传递给renderHTML
  // addAttributes() {}

  // 数组中的第一个值应该是 HTML 标记的名称。如果第二个元素是对象，则将其解释为一组属性。之后的任何元素都将呈现为子元素。
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), ['div', 0], ['div', 0]]
  },

  // 从div标签尝试去解析成vote
  parseHTML() {
    return [{ tag: 'div' }]
  }

  // addCommands() {
  //   return {
  //     setVote:
  //       () =>
  //       ({ chain, ...attrs }) => {
  //         chain().insertContent({ type: this.name, attrs, content: 666 }) .command(({ tr, commands }) => {
  //           const { doc, selection } = tr
  //           const position = doc.resolve(selection.to - 2).end()

  //           return commands.setTextSelection(position)
  //         })
  //         .run()
  //         // const { $to } = tr.selection
  //         // if (dispatch) {
  //         //   const node = $to.parent.type.contentMatch.defaultType?.create()
  //         //   tr.insert(tr.selection.to, node)
  //         //   dispatch(tr)
  //         // }
  //         // return true
  //       }
  //   }
  // }
})

export default Vote
