> 熟练掌握 Prosemirror 和 Tiptap，熟悉富文本编辑器、AIGC、协同文档;

## 说一下 prosemirror？

prosemirror 是 block-editor，分为 modal 定义 schema（nodes,marks），state 接受 schema 和插件，view，transform 4 个模块

## 说一下 tiptap？

基于 prosemirror 的编辑器，是基本可以开箱即用的编辑器，有大量完善 demo

## 说一下开发一个插件要考虑什么？

需要考虑是块还是行内元素以及一个还是多个，渲染和解析，键盘快捷键，commands 操作

## 说一下 AIGC？

主要用了 AI 来做文本处理，文本创作结合编辑器，需要 sse 连接接入流式数据，再用 typed.js 实现打字稿效果，再通过编辑器 API 插入到页面

## 说一下协同怎么做？

yjs 基于 CRDT 算法，不同于 OT 算法，在客户端可用
