# render 阶段

包含`reconciler`和`scheduler`

## 流程概览

`Fiber` 节点是如何被创建并构建 `Fiber` 树的

`render` 阶段开始于 `performSyncWorkOnRoot` 或 `performConcurrentWorkOnRoot` 方法的调用。这取决于本次更新是同步更新还是异步更新。

```js
// performSyncWorkOnRoot会调用该方法
function workLoopSync() {
  // workInProgress代表当前已创建的workInProgress fiber
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

// performConcurrentWorkOnRoot会调用该方法，异步，
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

可以看到，他们唯一的区别是是否调用 `shouldYield`。如果当前浏览器帧没有剩余时间，`shouldYield` 会中止循环，直到浏览器有空闲时间后再继续遍历

`performUnitOfWork` 方法会创建下一个 `Fiber` 节点并赋值给 `workInProgress`，并将 `workInProgress` 与已创建的 `Fiber` 节点连接起来构成 `Fiber` 树

我们知道 `Fiber Reconciler` 是从 `Stack Reconciler` 重构而来，通过遍历的方式实现可中断的递归，所以 `performUnitOfWork` 的工作可以分为两部分：“递”和“归”

#### 递阶段

首先从 `rootFiber` 开始向下深度优先遍历。遍历到的每个节点调用 `beginWork` 方法

该方法会根据传入的`Fiber`节点创建子`Fiber`节点，并将这两个`Fiber`节点连接起来

当遍历到叶子节点（即没有子组件的组件）时就会进入“归”阶段

在遍历过程中，`beginWork` 方法会根据 `Fiber` 节点上的 `alternate` 属性，进行当前节点和上次渲染的节点的比较，以便重用之前的 `Fiber` 节点，减少不必要的创建和销毁操作

#### 归阶段

在“归”阶段会调用 `completeWork` 处理 `Fiber` 节点

当某个 `Fiber` 节点执行完 `completeWork`，如果其存在兄弟 `Fiber` 节点（即 `fiber.sibling !== null`），会进入其兄弟 `Fiber` 的“递”阶段

如果不存在兄弟 `Fiber`，会进入父级 `Fiber` 的“归”阶段

“递”和“归”阶段会交错执行直到“归”到 `rootFiber`。至此，`render` 阶段的工作就结束了。

## beginWork

[源码位置](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberBeginWork.new.js#L3075)

#### 方法概览

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // ...省略函数体
}
```

current：当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 `workInProgress.alternate`
workInProgress：当前组件对应的 Fiber 节点
renderLanes：优先级相关，在讲解 Scheduler 时再讲解
除 rootFiber 以外， 组件 mount 时，由于是首次渲染，是不存在当前组件对应的 Fiber 节点在上一次更新时的 Fiber 节点，即 mount 时 current === null。

组件 update 时，由于之前已经 mount 过，所以 current !== null。

所以我们可以通过 current === null ?来区分组件是处于 mount 还是 update。

基于此原因，beginWork 的工作可以分为两部分：

update 时：如果 current 存在，在满足一定条件时可以复用 current 节点，这样就能克隆 current.child 作为 workInProgress.child，而不需要新建 workInProgress.child。

mount 时：除 fiberRootNode 以外，current === null。会根据 fiber.tag 不同，创建不同类型的子 Fiber 节点

```js
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // update时：如果current存在可能存在优化路径，可以复用current（即上一次更新的Fiber节点）
  if (current !== null) {
    // ...省略

    // 复用current
    return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
  } else {
    didReceiveUpdate = false
  }

  // mount时：根据tag不同，创建不同的子Fiber节点
  switch (workInProgress.tag) {
    case IndeterminateComponent:
    // ...省略
    case LazyComponent:
    // ...省略
    case FunctionComponent:
    // ...省略
    case ClassComponent:
    // ...省略
    case HostRoot:
    // ...省略
    case HostComponent:
    // ...省略
    case HostText:
    // ...省略
    // ...省略其他类型
  }
}
```

#### update 时

满足如下情况时 `didReceiveUpdate === false`（即可以直接复用前一次更新的子 `Fiber`，不需要新建子 `Fiber`）

`oldProps === newProps && workInProgress.type === current.type`，即 props 与 `fiber.type` 不变

`!includesSomeLane(renderLanes, updateLanes)`，即当前 `Fiber` 节点优先级不够，会在讲解 `Scheduler` 时介绍

#### mount 时

`mount` 也就是不满足优化条件，最终会走 `reconcileChildren`

#### reconcileChildren

对于 `mount` 的组件，他会创建新的子 `Fiber` 节点

对于 `update` 的组件，他会将当前组件与该组件在上次更新时对应的 `Fiber` 节点比较（也就是俗称的 `Diff` 算法），将比较的结果生成新 `Fiber` 节点

```js
export function reconcileChildren(
  current: Fiber | null,
  workInProgress: Fiber,
  nextChildren: any,
  renderLanes: Lanes
) {
  if (current === null) {
    // 对于mount的组件
    workInProgress.child = mountChildFibers(
      workInProgress,
      null,
      nextChildren,
      renderLanes
    )
  } else {
    // 对于update的组件
    workInProgress.child = reconcileChildFibers(
      workInProgress,
      current.child,
      nextChildren,
      renderLanes
    )
  }
}
```

从代码可以看出，和 `beginWork` 一样，他也是通过 `current === null`?区分 `mount` 与 `update`

不论走哪个逻辑，最终他会生成新的子 `Fiber` 节点并赋值给 `workInProgress.child`，作为本次 `beginWork` 返回值，并作为下次 `performUnitOfWork` 执行时 `workInProgress` 的传参。

值得一提的是，`mountChildFibers` 与 `reconcileChildFibers` 这两个方法的逻辑基本一致。唯一的区别是：`reconcileChildFibers` 会为生成的 `Fiber` 节点带上 `effectTag` 属性，而 `mountChildFibers` 不会。

#### effectTag

我们知道，`render `阶段的工作是在内存中进行，当工作结束后会通知 `Renderer` 需要执行的 `DOM` 操作。要执行 `DOM` 操作的具体类型就保存在 `fiber.effectTag` 中

#### 流程图

![Alt text](image-2.png)

## completeWork

#### 流程概览

####

## 总结

#### 说一下 render 阶段？

`render` 阶段包括 `reconciler` 和 ` scheduler``，reconciler ` 就是 `diff` 找出差异，而 `scheduler` 是调度任务

`render` 阶段开始于 同步的 `performSyncWorkOnRoot` 或者 异步的 `performConcurrentWorkOnRoot`，它们的主要差别是是否调用 `shouldYield`，然后调用 `performUnitOfWork`

`shouldYield` 就是打断更新的关键，当浏览器没有剩余时间，`shouldYield` 就会终止循环，直到浏览器有空闲时间再继续遍历

`performUnitOfWork` 可以分为递和归两个阶段，递会走 `beginWork`，归走 `completeWork`

`beginWork` 也就是通过 `alternate` 来 `diff`(update 时) 然后复用 `fiber` 节点，会根据 `tab` 不同创建不同的子 `fiber` 节点

`completeWork` 也是不同的 `workInProgress` 做不同的处理

#### 深度优先还是广度优先遍历 fiber 树的？

深度优先，调用每个 `fiber` 的 `beginWork`

#### 为什么 fiber.effectTab 要用二进制表示？

通过二进制表示 `effectTag`，可以方便的使用位操作为 `fiber.effectTag` 赋值多个 `effect`，并且节省内存空间
