## ref 的使用

```js
import { effect, reactive, ref } from '../../dist/mini-vue.esm-bundler.js'
debugger
const a = ref(1) //返回RefImpl实例

// 副作用函数、innerHTML渲染页面
effect(() => {
  document.querySelector('.app').innerHTML = a.value //收集依赖
})

setTimeout(() => {
  // 更新页面 想办法找到proxy.age对应的函数，去渲染页面
  // proxy  age
  a.value = 10
}, 1000)
```

## 返回一个 RefImpl 类的实例

RefImpl 包含 getter 和 setter，如果是对象会用 proxy 包裹，并把值保存到\_value

```js
export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    trackRefValue(this)
    return this._value
  }

  set value(newVal) {
    const useDirectValue =
      this.__v_isShallow || isShallow(newVal) || isReadonly(newVal)
    newVal = useDirectValue ? newVal : toRaw(newVal)
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal
      this._value = useDirectValue ? newVal : toReactive(newVal)
      triggerRefValue(this, newVal)
    }
  }
}
```

## effect 函数执行触发 getter

```js

```
