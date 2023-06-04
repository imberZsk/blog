> https://juejin.cn/post/7124955707723481125 这是之前的一部分理解，又写了一段时间 react 和 nextjs，再来补充一部分

## React 最佳实践

React 相对于 Vue 是比较自由的，这也意味着一个项目可能有多种写法，统一项目规范很重要

React（18） 的 API 是真的少，官网上的 Hook 有 15 个，源码里有几个官网上也没有写出来，看来是普通情况下用不上的 hook，除了 Hook，它的其他 API 也不多，大约 10 多 20 多个

- 避免传递不必要的的 props，props 应该只传子组件使用的部分，不要整个数据都传递防止占用内存过多

- 不能使用`arr.length&&<Component />`，0 虽然为假值，但仍然会被渲染，应该写成`arr.length > 0&&<Component />`

- 不要写`data&&data.map()`，应该使用可选链`data?.map()`
- 用 hooks 复用逻辑，把方法提取出去，在你等 jsx 里只需要 `const {xxx} = useXXX()`，然后渲染 xxx 就好了，也就是在 jsx 中应该看到不多的 js 代码
- 利用`useReducer和context`来集中管理状态，且尽量少使用 state，state 改变导致页面刷新消耗性能，但复杂一点的时候不太好管理，这个时候再用状态管理

- 遇到嵌套过多的情况，考虑用 children 来组装

## React18 的并发模式

https://juejin.cn/post/7223653429356773434
