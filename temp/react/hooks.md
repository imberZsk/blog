> 基础的 hook 就不说了，useState、useEffect、useRef

## useCallBack 和 useMemo

useMemo 和 useCallback 都是接受函数和依赖数组两个参数；不同的是 useMemo 缓存的是函数执行的返回值，useCallback 缓存的是函数本身，也就是 useCallback 等于 useMemo 接收的函数的返回值也是一个函数的时候

它们使是用来做性能优化的，但是自身也有性能开销，滥用反而造成性能浪费，要知道它们怎么性能优化的，得先去知道 React.memo，它的浅比较让父组件更新子组件不用更新

1、❤️ 将一个函数作为 props 传递给子组件，如果这个函数每次渲染都会被重新创建，就会导致子组件每次都会被重新渲染，使用 useCallback 使该函数引用保持不变再结合 React.memo 减少子组件重复更新

2、❤️ 当使用自定义 hook 的时候，如果要返回函数，可以包一层 useCallback

3、在使用 useEffect 的依赖项列表中，如果有函数，则需要先将函数使用 useCallback 进行包裹，这样可以保证依赖项变化时不会重新创建函数，从而避免不必要的副作用；

4、在使用 useMemo 的计算函数中，如果需要调用复杂的函数操作或者存在大量的计算，也可以使用 useCallback 提高性能；

## useImperativeHandle

拆分组件的时候，父组件获取子组件 ref 的时候用到，简单说就是父组件调用子组件的方法都时候用到，并且只导出需要的，配合`forwardRef`使用

```js
import Button from '@/comps/custom-button'
import { forwardRef, useImperativeHandle, useRef } from 'react'

const UseImperativeHandle: React.FC = () => {
  // 父组件
  const ref = useRef < HTMLInputElement > null
  function handleClick() {
    ref.current?.focus()
  }
  return (
    <div>
      <Button click={handleClick}>
        父组件调用子组件的方法/暴露子组件的ref或者方法
      </Button>
      <MyInput label="Enter your name:" ref={ref} />
    </div>
  )
}

type MyInputProps = {
  label: string
}

// 注意这个ref可以不用定义类型
const MyInput = forwardRef(function FaHandleSon(props: MyInputProps, ref) {
  const inputRef = useRef < HTMLInputElement > null
  const { label, ...otherProps } = props
  useImperativeHandle(
    ref,
    () => {
      return {
        focus() {
          inputRef.current?.focus()
        },
        scrollIntoView() {
          inputRef.current?.scrollIntoView()
        }
      }
    }
    // []
  )
  return (
    <div className="py-10">
      <label>
        {label}
        <input {...otherProps} ref={inputRef} className="text-black" />
      </label>
    </div>
  )
})

export default UseImperativeHandle
```

## useContext

这两个 hooks 结合可以用于管理一些简单的状态（一般是[{}]形式的数据，很方便做增删改查），但是稍微复杂点的时候就不适用了，一般项目还是状态管理比较适用

useContext 是获取上下文，通过 createContext 后会在全局上下文创建全局可以使用的数据，再通过 useContext 获取这个共享数据

useReducer 类似于 useState，功能类似 redux，适用于单个状态管理，虽然优雅但是写 TS 类型会更麻烦一点

```jsx
import Button from '@/comps/custom-button'
import { createContext, useContext, useRef, useState } from 'react'

// 创建context
const CountContext = createContext(0)

// 父组件
const UseContextAndUseReducer: React.FC = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <div className="py-10">父组件</div>
      <Button click={() => setCount((count) => count + 1)}>点击+1</Button>
      <br />
      <br />
      {/* 如果要结合useReducer,这个count就是调用useReducer后返回的state */}
      <CountContext.Provider value={count}>
        <Child></Child>
      </CountContext.Provider>
    </div>
  )
}

// 子组件
const Child: React.FC = () => {
  const count = useContext(CountContext)
  return <div>子组件收到数据共享：{count}</div>
}
```

## useReducer

## useLayoutEffect

相对于 useEffect，useLayoutEffect 是同步的，在 dom 更新完，浏览器绘制前执行，一般我们是异步比较好，不阻塞浏览器渲染

用来在浏览器重新绘制屏幕之前测量布局，如 getBoundingClientRect 获取布局信息展示 tooltip (如果 useEffect 可能初次渲染时会看不到内容，因为要 DOM 更新后才能拿到真正的布局信息)

```jsx
import { useLayoutEffect, useRef, useState } from 'react'

function UseLayoutEffect() {
  const ref = useRef < HTMLDivElement > null
  const [tooltipHeight, setTooltipHeight] = useState(0) // You don't know real height yet

  useLayoutEffect(() => {
    const { height } = (ref.current && ref.current.getBoundingClientRect()) || {
      height: 10
    }
    setTooltipHeight(height) // Re-render now that you know the real height
  }, [])
  return (
    <div>
      <div ref={ref}>{tooltipHeight}</div>
    </div>
  )
  // ...use tooltipHeight in the rendering logic below...
}

export default UseLayoutEffect
```

## useId

用于生成可以传递给可访问性属性的唯一 ID，但是不能用于列表渲染的 key

暂不清楚实际场景

## useDebugValue

用于测试 自定义 hook

```jsx
import { useSyncExternalStore, useDebugValue } from 'react'

function StatusBar() {
  const isOnline = useOnlineStatus()
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>
}

export default function UseDebugValue() {
  return <StatusBar />
}

function useOnlineStatus() {
  const isOnline = useSyncExternalStore(
    subscribe, //触发这个
    () => navigator.onLine, //返回这个
    () => true
  )
  useDebugValue(isOnline ? 'Online' : 'Offline')
  return isOnline
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function subscribe(callback: any) {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}
```

## useTransition

降低更新的优先级，更新意味着视图渲染，所以当更新拥有不同优先级后，这意味着视图渲染拥有不同优先级

在时间很长的时候有效果，要不然 loading 会闪现

```js
const [isPending, startTransition] = useTransition()
```

1、isPending 标记，告诉您是否有待处理的过渡。

2、startTransition 函数允许您将状态更新标记为过渡,也就是并发更新。

```jsx
import { useState, useTransition } from 'react'
import { Input } from 'antd'

const Index = () => {
  const [isPending, startTransition] = useTransition()
  const [input, setInput] = useState('')
  const [list, setList] = useState<string[]>([])

  return (
    <>
      <div>大量数据</div>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          startTransition(() => {
            const res: string[] = []
            for (let i = 0; i < 10000; i++) {
              res.push(e.target.value)
            }
            setList(res)
          })
        }}
      />
      {isPending ? (
        <div>加载中...</div>
      ) : (
        list.map((item, index) => <div key={index}>{item}</div>)
      )}
    </>
  )
}

export default Index
```

## useDeferredValue

useDeferredValue 用来处理数据本身，useTransition 用来处理更新函数，也是并发更新模式

可以在加载新数据的时候显示旧数据，有点过度的感觉，比如 input 框查询可以通过 css 过渡，感觉渐进的感觉

```jsx
const deferredValue = useDeferredValue(value)
```

value：接受一个可变的值，如 useState 所创建的值。 deferredValue：返回一个延迟状态的值。

```jsx
import { Suspense, useState, useDeferredValue } from 'react'
import SearchResults from './SearchResults.js'

export default function App() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const isStale = query !== deferredQuery
  return (
    <>
      <label>
        Search albums:
        <input value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>
      <Suspense fallback={<h2>Loading...</h2>}>
        <div
          style={{
            opacity: isStale ? 0.5 : 1,
            transition: isStale
              ? 'opacity 0.2s 0.2s linear'
              : 'opacity 0s 0s linear'
          }}
        >
          <SearchResults query={deferredQuery} />
        </div>
      </Suspense>
    </>
  )
}
```

## useInsertionEffect

useInsertionEffect 适用于 CSS-in-JS 库作者。除非您正在处理 CSS-in-JS 库，并且需要一个注入样式的地方，否则您可能想要 useEffect 或 useLayoutEffect。

## useSyncExternalStore

主要面向开源库作者，让现有的库支持并发模式，
也可以用于订阅浏览器 API，比如官网 demo 判断 navigator.onLine 是否断网

## 其他官网没有提及的

1、useMemoCache（减少性能优化心智负担）

这里简单聊聊 useMemoCache。长久以来，不管是 ClassComponent 的 shouldComponentUpdate，还是 FC 中 2 个性能优化相关 hook，都存在比较重的心智负担，比如：

开发者需要考虑是否需要性能优化，开发者需要考虑何时使用 useMemo、useCallback

为了解决这个问题，在 2021 年的 React Conf，黄玄带来了能够通过编译器生成等效于 useMemo、useCallback 代码的方案 —— React Forget。

useMemoCache 就是 React 内部为 React Forget 提供缓存支持的 hook。

2、useMutableSource 让现有库兼容并发模式

3、use 可以使用 RSC

4、useCacheRefresh 用于建立`<Suspense>`缓存

5、useOptimistic 用于 form 标签 action 属性（https://mp.weixin.qq.com/s?__biz=MzkzMjIxNTcyMA==&mid=2247492133&idx=1&sn=7a0d24b1561fd295ca4e5a1c0abfa1be&chksm=c25d8ce2f52a05f4a97f788e3b2989e56b85cd5736d037c15dcc4f5307c6cdd919598ad9945b#rd）

6、useFormStatus 用于 form 标签 action 属性

7、useEffectEvent（对 useEffect 能力的补充）
