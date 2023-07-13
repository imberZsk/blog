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

RefImpl 包含 属性访问器可以做到 getter 和 setter 功能，如果是对象会用 proxy 包裹，并把值保存到\_value

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

一步是 effect 执行之前说过了会初始化 activeEffect
然后触发 getter 执行 trackRefValue 最终返回\_value，把依赖存到 refImpl 上的 dep 里

```js
export function trackRefValue(ref: RefBase<any>) {
  if (shouldTrack && activeEffect) {
    ref = toRaw(ref)
    if (__DEV__) {
      trackEffects(ref.dep || (ref.dep = createDep()), {
        target: ref,
        type: TrackOpTypes.GET,
        key: 'value'
      })
    } else {
      trackEffects(ref.dep || (ref.dep = createDep()))
    }
  }
}

export function trackEffects(
  dep: Dep,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  let shouldTrack = false
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit // set newly tracked
      shouldTrack = !wasTracked(dep)
    }
  } else {
    // Full cleanup mode.
    shouldTrack = !dep.has(activeEffect!)
  }

  if (shouldTrack) {
    // effect会初始化activeEffect，所以这个activeEffect是有的
    dep.add(activeEffect!)
    activeEffect!.deps.push(dep)
  }
}
```

## 更新的时候触发 setter

ref 就是之前的 refImpl，就能从 this.dep 上拿到依赖，triggerEffects 然后又是之前的逻辑

```js
export function triggerRefValue(ref: RefBase<any>, newVal?: any) {
  ref = toRaw(ref)
  const dep = ref.dep
  if (dep) {
    if (__DEV__) {
      triggerEffects(dep, {
        target: ref,
        type: TriggerOpTypes.SET,
        key: 'value',
        newValue: newVal
      })
    } else {
      triggerEffects(dep)
    }
  }
}

export function triggerEffects(
  dep: Dep | ReactiveEffect[],
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  // spread into array for stabilization
  const effects = isArray(dep) ? dep : [...dep]
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect, debuggerEventExtraInfo)
    }
  }
}

function triggerEffect(
  effect: ReactiveEffect,
  debuggerEventExtraInfo?: DebuggerEventExtraInfo
) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (__DEV__ && effect.onTrigger) {
      effect.onTrigger(extend({ effect }, debuggerEventExtraInfo))
    }
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}
```

## 核心逻辑总结

ref 会 返回 RefImpl 类，这个类有属性访问器，也能实现 Proxy 一样的拦截功能，类上会保存一个\_value 来存数据，如果是对象会走 reactive
