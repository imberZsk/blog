## React 理念

`React` 的理念是快速响应的大型 `Web` 应用程序，制约快速响应有两类场景

#### CPU 瓶颈

原因：当大量操作或者设备性能不足导致掉帧卡顿，本质原因是` JS 引擎线程和渲染线程是互斥的`，大量 `JS` 执行的时候没有时间去做渲染

解决：`时间分片`，把长任务拆分到每一帧中，时间分片的关键是将同步更新变为可中断的异步更新

#### IO 瓶颈

原因：下一个页面是异步的，如果打开下个页面时间很短也会显示 `loading`

解决：实现 `Suspense` 和 `useDeferredValue`，在当前页面停留一点时间，用户是无感知的，然后超过某个时间再给 `loading`，关键也同上

## 老的 React 架构

`React15` 的架构可以分为两层，`Reconciler`（协调器）负责找出变化的组件和 `Renderer`（渲染器）负责将变化的组件渲染到页面上（交替执行，无法中断）

老的架构中 `Reconciler` 会`递归`mountComponent 挂载组件 和 updateComponent `更新组件`，被称为 `Stack Reconciler`

## 新的 React 架构

`React16` 架构可以分为三层

`Scheduler`（调度器）负责调度任务的优先级，高优先级优先进入 `Reconciler`，用 `scheduler` 代替 `requestIdleCallback`

`Reconciler`（协调器）负责找出变化的组件，更新工作从递归变成了可以中断的 `while` 循环，每次循环都会调用 `shouldYield` 判断当前是否有剩余时间；`Reconciler` 和 `Renderer` 不再是交替工作，`Reconcile` 会为虚拟 `DOM` 打上增/删/更新的标记，都在内存中运行，只有所有组件都完成 `Reconciler`，才会统一交给 `Renderer`

```js
function workLoopConcurrent() {
  // Perform work until Scheduler asks us to yield
  while (workInProgress !== null && !shouldYield()) {
    workInProgress = performUnitOfWork(workInProgress)
  }
}
```

`Renderer`（渲染器）负责将变化的组件渲染到页面上，由于工作都在内存中运行，不会更新页面上的 `DOM`，所以即使反复中断，用户也不会看见更新不完全的 `DOM`

## Fiber 架构的心智模型

代数效应：副作用从函数调用中分离 ->在 `React` 中的应用是 `Hooks`

#### 代数效应和生成器 Generator

弊端一：类似 `async`，`Generator` 也是`传染性`的，使用了`Generator`则上下文的其他函数也需要作出改变。这样心智负担比较重。

弊端二：`Generator` 执行的中间状态是上下文关联的。（高优先级插队无法复用之前的）

#### 代数效应和 Fiber

`Fiber` 是`协程`的一种实现，是代数效应思想在 JS 中的体现

`React` 内部实现了一套状态更新机制，支持任务不同优先级，可中断与恢复，并且恢复后可以服用之前的`中间状态`

## Fiber 架构的实现原理（Fiber 的含义）

#### 作为架构来说

`React15` 的 `Reconciler` 采用递归的方式执行，数据保存在递归数据栈中，所以被称问 `Stack Fiber`，`React16` 的 Reconciler 基于 `Fiber` 节点，被称为 `Fiber Reconciler`

#### 作为静态数据结构来说

每个 `Fiber` 对应一个 `React Element`，保存了该组件的类型，对应 `DOM` 节点信息

#### 作为动态工作单元来说

每个 `Fiber` 节点保留了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入到页面/被更新）

## Fiber 架构的工作原理

双缓存：内存中构建并直接替换的技术

双缓冲 `Fiber` 树，`workInProgress` 和 `Current` 交替，通过 `alternate` 连接

#### mount 时

创建 `fiberRootNode` 和 `rootFiber`，其中 `fiberRoot` 时整个应用的根节点只有一个，`rootFiber` 时`<App/>`所在组件树的根节点，多次 `ReactDOM.render`
渲染不同组件树，会拥有不同的`rootFiber`，刚开始由于时首屏渲染，页面中没有挂载任何`DOM`，所以`fiberRootNode.current`指向 `rootFiber`且后面没任何节点

然后时 render 阶段，在内存中依次创建 fiber 节点并连接在一起构建 fiber 树，也就是 `workInProgress Fiber` 树，会尝试复用 `current Fiber` 树，在首屏渲染时只有 `rootFiber` 存在对应的 `current fiber`

然后到了 `commit` 阶段，构建完的 `workInProgress Fiber`渲染到页面，然后`fiberRootNode`的`current`指向`workInProgress Fiber`,变为`current Fiber`树

#### update 时

点击加一时，开启一次新的 `render` 阶段并构建一颗新的`workInProgress Fiber`树，也复用 `current fiber` 树对应数据(是否复用取决于 diff)，然后 commit 阶段渲染到页面，`workInProgress`变为`current`

## 双缓存 fiber 树

在 `React` 中最多会同时存在两棵`Fiber` 树。当前屏幕上显示内容对应的 `Fiber` 树称为 `current Fiber` 树，正在内存中构建的 `Fiber` 树称为 `workInProgress Fiber` 树。

`current Fiber` 树中的 `Fiber` 节点被称为 `current fiber`，`workInProgress Fiber` 树中的 `Fiber` 节点被称为 `workInProgress fiber`，他们通过 `alternate` 属性连接。

`currentFiber.alternate === workInProgressFiber`;
`workInProgressFiber.alternate === currentFiber`;
`React` 应用的根节点通过使 `current` 指针在不同 `Fiber` 树的 `rootFiber` 间切换来完成 `current Fiber` 树指向的切换。

即当 `workInProgress Fiber` 树构建完成交给 `Renderer` 渲染在页面上后，应用根节点的 current 指针指向 `workInProgress Fiber` 树，此时 `workInProgress Fiber` 树就变为 `current Fiber` 树。

每次状态更新都会产生新的 `workInProgress` `Fiber` 树，通过 `current` 与 `workInProgress` 的替换，完成 `DOM` 更新。

## 总结

#### 新老 `React` 架构有什么区别？

老的 React 架构只有两层也就是协调器找出变化和渲染器将变化的部分渲染到页面，而新的架构多了一层 `Scheduler` 调度器，协调器找出变化后首先走调度器，看是否有时间执行，再走渲染器渲染到页面

#### 为什么需要 fiber？

由于老的 `stack reconciler` 是递归不可中断的更新，在组件树较大时可能会造成卡顿，为了解决这个问题，React 用 `fiber` 实现了异步可打断更新，解决卡顿问题

#### fiber 的理解？

作为架构来说是 `fiber reconciler` 一种新架构，作为静态数据结构来说，每个 `fiber` 对应了一个 `React Element`，保存了节点信息，作为动态工作单元来说，每个 `fiber` 节点保留了本次更新中组件改变的状态，要执行的工作

#### fiber 存了哪些信息举例？

比如静态数据结构 `tag，key，type`，用于连接其它节点生成 `fiber` 树的 `return sibling child`，作为动态工作单元的 `memoizedProps，updateQueue，memoizedState`，还有调度相关的 `lanes，alternate` 等

#### fiber `工作原理？

fiber`架构实现了双缓存树，分为`mount`和`update` 两部份，创建`fiberRoot`的`current`指向`rootFiber`，然后 `alternate`复用节点，然后`workInProgress`树变为`current`树，然后`commit` 渲染到页面

#### rootFiber 和 fiberRoot 有什么关系？

`fiberRoot` 只有一个，是页面的的根阶段，`rootFiber` 可以有不同的，多次 `ReactDOM.render` 渲染不同组件树

![Alt text](image-1.png)
