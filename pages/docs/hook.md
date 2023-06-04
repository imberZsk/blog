> 基础的 hook 就不说了，useState、useEffect,useRef

## useCallBack 和 useMemo

useMemo 和 useCallback 都是接受函数和依赖数组两个参数；不同的是 useMemo 缓存的是函数执行的返回值，useCallback 缓存的是函数本身，也就是 useCallback 等于 useMemo 接收的函数的返回值也是一个函数的时候

它们使是用来做性能优化的，但是自身也有性能开销，滥用反而造成性能浪费，要知道它们怎么性能优化的，得先去知道 React.memo，它的浅比较让父组件更新子组件不用更新

1、将一个函数作为 props 传递给子组件，如果这个函数每次渲染都会被重新创建，就会导致子组件每次都会被重新渲染，使用 useCallback 使该函数引用保持不变再结合 React.memo 减少子组件重复更新

```js
import { memo, useCallback } from 'react'
import Button from '@/comps/custom-button'
import { useState } from 'react'

const UseCallbackAndUseMemo: React.FC = () => {
  const [num, setNum] = useState(0)

  const fn1 = () => {
    console.log('fn1')
  }

  const fn2 = useCallback(() => {
    console.log('fn2')
  }, [])

  return (
    <div>
      <Button
        click={() => {
          // 父组件的状态更新，不影响子组件的时候，也就是说这个状态跟子组件没关系
          setNum(num + 1)
        }}
      >
        减少子组件重新渲染/优化自定义hook
      </Button>
      <Child fn={fn1}></Child>
      <ChildWithUseCallback fn={fn2}></ChildWithUseCallback>
      <h1>{num}</h1>
    </div>
  )
}

type IChildProps = {
  fn: () => void
}

const Child: React.FC<IChildProps> = memo(({ fn }) => {
  console.log('没有用useCallback，导致子组件重新更新')
  return (
    <div className="my-10">
      <Button click={fn}>memo without useCallback</Button>
    </div>
  )
})

const ChildWithUseCallback: React.FC<IChildProps> = memo(({ fn }) => {
  console.log('用了useCallback，子组件不用重新更新')
  return (
    <div className="my-10">
      <Button click={fn}>memo with useCallback</Button>
    </div>
  )
})

export default UseCallbackAndUseMemo
```

2、在使用 useEffect 的依赖项列表中，如果有函数，则需要先将函数使用 useCallback 进行包裹，这样可以保证依赖项变化时不会重新创建函数，从而避免不必要的副作用；

3、在使用 useMemo 的计算函数中，如果需要调用复杂的函数操作或者存在大量的计算，也可以使用 useCallback 提高性能；

4、当使用自定义 hook 的时候，如果要返回函数，可以包一层 useCallback，看了 ahooks 的源码，其实情况挺少的

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
    },
    []
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

## useContext 和 useReducer

这两个 hooks 结合可以用于管理一些简单的状态（一般是[{}]形式的数据，很方便做增删改查），但是稍微复杂点的时候就不适用了，一般项目还是状态管理比较适用

useContext 是获取上下文，通过 createContext 后会在全局上下文创建全局可以使用的数据，再通过 useContext 获取这个共享数据

useReducer 类似于 useState，功能类似 redux，适用于单个状态管理，虽然优雅但是写 TS 类型会更麻烦一点

```jsx
import Button from '@/comps/custom-button'
import { createContext, useContext, useReducer, useRef, useState } from 'react'

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
      <br />
      <StateDemo></StateDemo>
      <br />
      <ReducerDemo></ReducerDemo>
    </div>
  )
}

// 子组件
const Child: React.FC = () => {
  const count = useContext(CountContext)
  return <div>子组件收到数据共享：{count}</div>
}

// useState修改[{}]
const StateDemo = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [state, setState] = useState([
    {
      name: 'imber',
      age: 18
    },
    {
      name: 'ding',
      age: 16
    }
  ])

  // 如果用state管理数据需要每次解构一层，再在新的数据上处理后setState
  const add = () => {
    const obj = {
      name: inputRef.current?.value || 'hello',
      age: 10
    }
    const newState = [...state]
    newState.push(obj)
    setState(newState)
  }

  return (
    <div>
      state管理数据
      <br />
      <div>
        <span onClick={add}> 新增：</span>{' '}
        <input className="text-black" type="text" ref={inputRef} />
      </div>
      {state.map((item, index) => {
        return (
          <div className="flex" key={index}>
            <br />
            <div className="mr-10">name:{item.name}</div>
            <div>age:{item.age}</div>
          </div>
        )
      })}
    </div>
  )
}

// useReducer修改[{}]
const ReducerDemo = () => {
  const inputRef = useRef<HTMLInputElement>(null)

  const initValue = [
    {
      name: 'imber',
      age: 18
    },
    {
      name: 'ding',
      age: 16
    }
  ]

  type Action = {
    type: string
    payload: {
      name: string
      age: number
    }
  }

  const reducer = (state: typeof initValue, action: Action) => {
    console.log(action)
    switch (action.type) {
      case 'add':
        return [...state, action.payload]
        break
      default:
        return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initValue)

  const add = () => {
    dispatch({
      type: 'add',
      payload: { name: inputRef.current?.value || '', age: 18 }
    })
  }

  return (
    <div>
      reducer管理数据
      <div>
        <span onClick={add}> 新增：</span>{' '}
        <input className="text-black" type="text" ref={inputRef} />
      </div>
      {state.map((item, index) => {
        return (
          <div className="flex" key={index}>
            <br />
            <div className="mr-10">name:{item.name}</div>
            <div>age:{item.age}</div>
          </div>
        )
      })}
    </div>
  )
}

export default UseContextAndUseReducer
```

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

使用服务器渲染，useId 要求服务器和客户端上具有相同的组件树。如果您在服务器上渲染的树和客户端不完全匹配，则生成的 ID 将不匹配

```jsx
import { useId } from 'react'

function PasswordField() {
  const passwordHintId = useId()
  return (
    <>
      <label>
        Password:
        <input type="password" aria-describedby={passwordHintId} />
      </label>
      <p id={passwordHintId}>
        The password should contain at least 18 characters
      </p>
    </>
  )
}

export default function App() {
  return (
    <>
      <h2>Choose password</h2>
      <PasswordField />
      <h2>Confirm password</h2>
      <PasswordField />
    </>
  )
}
```

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
    subscribe,
    () => navigator.onLine,
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

## useSyncExternalStore

## useTransition

## useInsertionEffect

## useDeferredValue
