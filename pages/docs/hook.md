> 基础的 hook 就不说了，useState、useEffect、useRef

## useCallBack 和 useMemo

useMemo 和 useCallback 都是接受函数和依赖数组两个参数；不同的是 useMemo 缓存的是函数执行的返回值，useCallback 缓存的是函数本身，也就是 useCallback 等于 useMemo 接收的函数的返回值也是一个函数的时候

他们自身也有性能开销，滥用反而造成性能浪费，要知道它们怎么性能优化的，得先去知道 React.memo，它的浅比较让父组件更新子组件不用更新

第一个使用场景：将一个函数作为 props 传递给子组件，如果这个函数每次渲染都会被重新创建，就会导致子组件每次都会被重新渲染，使用 useCallback 使该函数引用保持不变再结合 React.memo 减少子组件重复更新

第二个使用场景：当使用自定义 hook 的时候，如果要返回函数，可以包一层 useCallback

```js
import React, { useState, useCallback } from 'react'

// 定义自定义hook
function useCustomHook(callback) {
  const [count, setCount] = useState(0)

  const handleClick = useCallback(() => {
    setCount(count + 1)
    callback()
  }, [count, callback])

  return {
    count,
    handleClick
  }
}

// 在组件中使用自定义hook
function MyComponent() {
  const handleClick = useCallback(() => {
    console.log('clicked')
  }, [])

  const { count, handleClick: customHandleClick } = useCustomHook(handleClick)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={customHandleClick}>Increase</button>
    </div>
  )
}
```

> 少见的情况：
> 1、在使用 useEffect 的依赖项列表中，如果有函数，则需要先将函数使用 useCallback 进行包裹，这样可以保证依赖项变化时不会重新创建函数，从而避免不必要的副作用；
> 2、在使用 useMemo 的计算函数中，如果需要调用复杂的函数操作或者存在大量的计算，也可以使用 useCallback 提高性能；

## useImperativeHandle

父组件调用子组件的时候用到，并且只导出需要的，配合`forwardRef`使用

```js
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

export default MyInput
```

## useReducer 和 useContext

## useDebugValue

## useDeferredValue

## useId

## useInsertionEffect

## useLayoutEffect

## useSyncExternalStore

## useTransition
