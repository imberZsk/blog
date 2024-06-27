> 熟练掌握 React 和 TypeScript，熟悉 HTTP 协议，深入研究过 React 底层原理

## 说一下 http1.1 和 http2 的区别？

- 多路复用，解决队头阻塞
- 服务器推送
- 二进制分帧
- 优先级机制
- 头部信息压缩
- 默认永久连接

## https 加密原理？

http 加 ssl/tls 安全层，需要申请 CA 证书，用对称加密和非对称加密

## 输入 url 到页面渲染的过程

首先是网络过程，url 规范化，浏览器缓存检查，dns 解析，tcp 连接，发送 http 请求，服务端返回数据，tcp 连接关闭，到了渲染过程，生成 dom 树，css 对象树，然后样式计算，布局，分层，绘制，分块，光栅化，合成

## React 如何性能优化？

- 首先用 performance 定位问题，看长任务，卡顿帧
- useCallback 和 useMemo 和 memo
- key，懒加载，组件卸载清理定时器
- 变与不变分离

## 对 fiber 的理解？

解决性能瓶颈而出现的

作为架构来说是 `fiber reconciler` 一种新架构，作为静态数据结构来说，每个 `fiber` 对应了一个 `React Element`，保存了节点信息，作为动态工作单元来说，每个 `fiber` 节点保留了本次更新中组件改变的状态，要执行的工作

## React 的 diff 算法？

分为单节点 diff 和多节点 diff

单节点 diff 的时候，只需看 key 和 tag 相不相同

多节点 diff 的时候

- 第一轮遍历，从左到右，直到 newFiber 或者 oldFiber 遍历完了， 或者都没有遍历完，此时跳出遍历
- 理想情况是都遍历完，如果 newFiber 没有遍历完，则打上插入标记，如果是 oldFiber 没遍历完，则打上删除标记，都没遍历完，则到了 diff 核心
- 第二轮遍历，以 oldFiber 维护一个 map，去 newFiber 里去找是否有相同的节点，然后移动节点来保证复用
