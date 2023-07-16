<!-- ![img]('./../1.png') -->

## reactive 和 effect 的使用

```js
import { effect, reactive } from '../../dist/mini-vue.esm-bundler.js'

const obj = {
  name: 'imber',
  age: 18
}

const proxy = reactive(obj)

// 副作用函数、innerHTML渲染页面
effect(() => {
  document.querySelector('.app').innerHTML = proxy.age //读取数据，触发收集依赖
})

setTimeout(() => {
  proxy.age = 10 //设置数据，出发更新依赖，也就是找到之前的effect里面的callback重新执行
}, 1000)
```

## 入口导出两个函数

index.ts

```js
// dev打包入口
export { reactive } from './effect'
export { reactive } from './reactive'
```

## reactive 通过 proxy 代理对象

> 给对象包一层 reactive 变成响应式数据，核心就是使用 proxy

reactive.ts 导出 reactive

```js
import { isObject, toRawType } from '@vue/shared'
import { mutableHandlers } from './baseHandlers'

// 声明一个枚举对象
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}
// 传入对象的类型，可能有上面枚举的属性
export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

export const reactiveMap = new WeakMap<Target, any>()

const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}

function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

function getTargetType(value: Target) {
  // 如果有__v_skip或者对象不能扩展
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID //0
    : targetTypeMap(toRawType(value)) //获取类型
}

export function reactive(target: object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    // mutableCollectionHandlers, //暂时不知道
    reactiveMap
  )
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  // collectionHandlers: ProxyHandler<any>, //MapSet等的处理，暂时不用
  proxyMap: WeakMap<Target, any>
) {
  //reactive只能包装对象
  if (!isObject(target)) {
    return target
  }
  // 如果以及是reactive数据了直接返回/TODO:
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // 是否在proxyMap上有的
  const existingProxy = proxyMap.get(target)
  // 存在说明收集过了直接返回
  if (existingProxy) {
    return existingProxy
  }
  // 只能是一些特定的对象才能被proxy
  const targetType = getTargetType(target)
  // 如果是 TargetType.INVALID 则不能被监听
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    // 除了对象和数组，如果是上面的Map等用特殊的collectionHandlers，这里注释掉，暂时看对象和数组
    // targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
    baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

general.ts 工具函数

```js
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const objectToString = Object.prototype.toString

export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}
```

## track 收集依赖

## proxy 的 baseHandler

> reactive proxy 代理的核心逻辑，依赖收集与触发对应着 setter 和 getter

baseHandlers.ts 先看看 getter (这里有数组的 case 处理，readonly 的 handler)

```js
import { hasOwn, isArray, isIntegerKey, isObject } from '@vue/shared'
import { readonly, ReactiveFlags, Target, reactive } from './reactive'
import { isRef } from './ref'
import { track } from './effect'
import { TrackOpTypes } from './operations'

const get = /*#__PURE__*/ createGetter()
const readonlyGet = /*#__PURE__*/ createGetter(true)

const arrayInstrumentations = /*#__PURE__*/ createArrayInstrumentations()

// 对数组的处理一些边缘case
function createArrayInstrumentations() {
  const instrumentations: Record<string, Function> = {}
  // instrument identity-sensitive Array methods to account for possible reactive
  // values
  ;(['includes', 'indexOf', 'lastIndexOf'] as const).forEach(key => {
    // @ts-ignore
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      // TODO:数组的处理，暂不清楚，大约是proxy去includes原对象，也是true
      // const arr = toRaw(this) as any
      // for (let i = 0, l = this.length; i < l; i++) {
      //   track(arr, TrackOpTypes.GET, i + '')
      // }
      // // we run the method using the original args first (which may be reactive)
      // const res = arr[key](...args)
      // if (res === -1 || res === false) {
      //   // if that didn't work, run it again using raw values.
      //   return arr[key](...args.map(toRaw))
      // } else {
      //   return res
      // }
    }
  })
  // instrument length-altering mutation methods to avoid length being tracked
  // which leads to infinite loops in some cases (#2137)
  ;(['push', 'pop', 'shift', 'unshift', 'splice'] as const).forEach(key => {
    // @ts-ignore
    instrumentations[key] = function (this: unknown[], ...args: unknown[]) {
      //     pauseTracking()
      //     const res = (toRaw(this) as any)[key].apply(this, args)
      //     resetTracking()
      //     return res
    }
  })
  return instrumentations
}

// @ts-ignore hasOwnProperty的边缘case
function hasOwnProperty(this: object, key: string) {
  // const obj = toRaw(this)
  // track(obj, TrackOpTypes.HAS, key)
  // return obj.hasOwnProperty(key)
}

// getter
function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Target, key: string | symbol, receiver: object) {
    // 如果是取的内置的_几个属性
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (key === ReactiveFlags.IS_SHALLOW) {
      return shallow
    }

    // else if (
    //   key === ReactiveFlags.RAW &&
    //   receiver ===
    //     (isReadonly
    //       ? shallow
    //         ? shallowReadonlyMap
    //         : readonlyMap
    //       : shallow
    //       ? shallowReactiveMap
    //       : reactiveMap
    //     ).get(target)
    // ) {
    //   return target
    // }

    // 如果是数组，数组和对象有些处理不同，Map等响应式在collectionHandlers
    const targetIsArray = isArray(target)

    if (!isReadonly) {
      // 判断是数组且10个方法可以收集依赖，数组的收集依赖也在里面
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver)
      }
      // 如果是hasOwnProperty去收集依赖然后调用原来的方法
      if (key === 'hasOwnProperty') {
        return hasOwnProperty
      }
    }

    const res = Reflect.get(target, key, receiver)

    // 如果是symbol
    // if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
    //   return res
    // }

    // 核心逻辑
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }

    // if (shallow) {
    //   return res
    // }

    // ref解包
    if (isRef(res)) {
      // ref unwrapping - skip unwrap for Array + integer key.
      return targetIsArray && isIntegerKey(key) ? res : res.value
    }

    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    return res
  }
}

// 普通对象情况
export const mutableHandlers: ProxyHandler<object> = {
  get
  // set
  // deleteProperty,
  // has,
  // ownKeys
}

//readonly情况
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  // @ts-ignore
  set(target, key) {
    // if (__DEV__) {
    //   warn(
    //     `Set operation on key "${String(key)}" failed: target is readonly.`,
    //     target
    //   )
    // }
    return true
  },
  // @ts-ignore
  deleteProperty(target, key) {
    // if (__DEV__) {
    //   warn(
    //     `Delete operation on key "${String(key)}" failed: target is readonly.`,
    //     target
    //   )
    // }
    return true
  }
}

```

reactive.ts 里面新增 类型和 readonly

````js
import { isObject, toRawType } from '@vue/shared'
import { mutableHandlers, readonlyHandlers } from './baseHandlers'

// 声明一个枚举对象
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  IS_SHALLOW = '__v_isShallow',
  RAW = '__v_raw'
}
// 传入对象的类型，可能有上面枚举的属性
export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.IS_SHALLOW]?: boolean
  [ReactiveFlags.RAW]?: any
}

// 收集依赖的
export const reactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()

// 对象类型对应的type,用于判断哪种处理
const enum TargetType {
  INVALID = 0,
  COMMON = 1,
  COLLECTION = 2
}

//获取对象类型
function targetTypeMap(rawType: string) {
  switch (rawType) {
    case 'Object':
    case 'Array':
      return TargetType.COMMON
    case 'Map':
    case 'Set':
    case 'WeakMap':
    case 'WeakSet':
      return TargetType.COLLECTION
    default:
      return TargetType.INVALID
  }
}

//获取对象类型
function getTargetType(value: Target) {
  // 如果有__v_skip或者对象不能扩展
  return value[ReactiveFlags.SKIP] || !Object.isExtensible(value)
    ? TargetType.INVALID //0
    : targetTypeMap(toRawType(value)) //获取类型
}

// reactive入口
export function reactive(target: object) {
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    // mutableCollectionHandlers, //暂时不知道
    reactiveMap
  )
}

/**
 * Takes an object (reactive or plain) or a ref and returns a readonly proxy to
 * the original.
 *
 * A readonly proxy is deep: any nested property accessed will be readonly as
 * well. It also has the same ref-unwrapping behavior as {@link reactive()},
 * except the unwrapped values will also be made readonly.
 *
 * @example
 * ```js
 * const original = reactive({ count: 0 })
 *
 * const copy = readonly(original)
 *
 * watchEffect(() => {
 *   // works for reactivity tracking
 *   console.log(copy.count)
 * })
 *
 * // mutating original will trigger watchers relying on the copy
 * original.count++
 *
 * // mutating the copy will fail and result in a warning
 * copy.count++ // warning!
 * ```
 *
 * @param target - The source object.
 * @see {@link https://vuejs.org/api/reactivity-core.html#readonly}
 */
export function readonly<T extends object>(target: T): any {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    // readonlyCollectionHandlers,
    readonlyMap
  )
}

// reactive核心函数
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  // collectionHandlers: ProxyHandler<any>, //MapSet等的处理，暂时不用
  proxyMap: WeakMap<Target, any>
) {
  //reactive只能包装对象
  if (!isObject(target)) {
    return target
  }
  // 如果以及是reactive数据了直接返回/TODO:
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }
  // 是否在proxyMap上有的
  const existingProxy = proxyMap.get(target)
  // 存在说明收集过了直接返回
  if (existingProxy) {
    return existingProxy
  }
  // 只能是一些特定的对象才能被proxy
  const targetType = getTargetType(target)
  // 如果是 TargetType.INVALID 则不能被监听
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    // 除了对象和数组，如果是上面的Map等用特殊的collectionHandlers，这里注释掉，暂时看对象和数组
    // targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
    baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}

````

ref.ts 里面增加 isRef

```js
declare const RefSymbol: unique symbol

export interface Ref<T = any> {
  value: T
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
}

export function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
export function isRef(r: any): r is Ref {
  return !!(r && r.__v_isRef === true)
}

```

operations.ts 枚举了几个类型

```js
// using literal strings instead of numbers so that it's easier to inspect
// debugger events

export const enum TrackOpTypes {
  GET = 'get',
  HAS = 'has',
  ITERATE = 'iterate'
}

export const enum TriggerOpTypes {
  SET = 'set',
  ADD = 'add',
  DELETE = 'delete',
  CLEAR = 'clear'
}

```

general.ts 里面新增工具函数

```js
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (
  val: object,
  key: string | symbol
): key is keyof typeof val => hasOwnProperty.call(val, key)

export const isArray = Array.isArray

export const isString = (val: unknown): val is string => typeof val === 'string'
export const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object'

export const objectToString = Object.prototype.toString

export const toTypeString = (value: unknown): string =>
  objectToString.call(value)

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1)
}

export const isIntegerKey = (key: unknown) =>
  isString(key) &&
  key !== 'NaN' &&
  key[0] !== '-' &&
  '' + parseInt(key, 10) === key
```

再看 setter

## effect 函数 执行

effect 接受 callback 作为参数，执行 effect 函数，初始化一个 ReactiveEffect 类

会直接调用一次 ReactiveEffect 里的 this.fn 也就是传入 effect 的 callback，触发 getter

```js
export function effect<T = any>(
  fn: () => T,
  options?: ReactiveEffectOptions
): ReactiveEffectRunner {
  if ((fn as ReactiveEffectRunner).effect) {
    fn = (fn as ReactiveEffectRunner).effect.fn
  }

  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options)
    if (options.scope) recordEffectScope(_effect, options.scope)
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
  const runner = _effect.run.bind(_effect) as ReactiveEffectRunner
  runner.effect = _effect
  return runner
}

export class ReactiveEffect<T = any> {
  active = true
  deps: Dep[] = []
  parent: ReactiveEffect | undefined = undefined

  /**
   * Can be attached after creation
   * @internal
   */
  computed?: ComputedRefImpl<T>
  /**
   * @internal
   */
  allowRecurse?: boolean
  /**
   * @internal
   */
  private deferStop?: boolean

  onStop?: () => void
  // dev only
  onTrack?: (event: DebuggerEvent) => void
  // dev only
  onTrigger?: (event: DebuggerEvent) => void

  constructor(
    public fn: () => T,
    public scheduler: EffectScheduler | null = null,
    scope?: EffectScope
  ) {
    recordEffectScope(this, scope)
  }

  run() {
    if (!this.active) {
      return this.fn()
    }
    let parent: ReactiveEffect | undefined = activeEffect
    let lastShouldTrack = shouldTrack
    while (parent) {
      if (parent === this) {
        return
      }
      parent = parent.parent
    }
    try {
      this.parent = activeEffect
      activeEffect = this
      shouldTrack = true

      trackOpBit = 1 << ++effectTrackDepth

      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this)
      } else {
        cleanupEffect(this)
      }
      return this.fn()
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this)
      }

      trackOpBit = 1 << --effectTrackDepth

      activeEffect = this.parent
      shouldTrack = lastShouldTrack
      this.parent = undefined

      if (this.deferStop) {
        this.stop()
      }
    }
  }

  stop() {
    // stopped while running itself - defer the cleanup
    if (activeEffect === this) {
      this.deferStop = true
    } else if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}
```

## 触发 getter 使用 track 收集依赖

getter 的时候收集依赖，收集到的是哪个对象的哪个 key 对应的 ReactiveEffect，然后 ReactiveEffect 身上的 this.fn 就是最终要找的，后续让 getter 找到重新执行

收集的依赖结构为 WeakMap Map Set(ReactiveEffect)放在 全局变量 targetMap 里

```js
//getter在上面的baseHandler那个地方执行，核心就是触发track
export function track(target: object, type: TrackOpTypes, key: unknown) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
      depsMap.set(key, (dep = createDep()))
    }

    const eventInfo = __DEV__
      ? { effect: activeEffect, target, type, key }
      : undefined

    trackEffects(dep, eventInfo)
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
    dep.add(activeEffect!)//核心收集依赖
    activeEffect!.deps.push(dep)
    if (__DEV__ && activeEffect!.onTrack) {
      activeEffect!.onTrack(
        extend(
          {
            effect: activeEffect!
          },
          debuggerEventExtraInfo!
        )
      )
    }
  }
}
```

## trigger 触发依赖

改变代理对象的时候触发 setter，根据之前收集的依赖找到对应的 ReactiveEffect(this.fn)，遍历执行，页面重新渲染

从全局依赖变量 targetMap 取取出来遍历执行

```js
//getter在上面的baseHandler那个地方执行，核心就是触发trigger
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked
    return
  }

  let deps: (Dep | undefined)[] = []
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    deps = [...depsMap.values()]
  } else if (key === 'length' && isArray(target)) {
    const newLength = Number(newValue)
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= newLength) {
        deps.push(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
    if (key !== void 0) {
      deps.push(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          deps.push(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const eventInfo = __DEV__
    ? { target, type, key, newValue, oldValue, oldTarget }
    : undefined

  if (deps.length === 1) {
    if (deps[0]) {
      if (__DEV__) {
        triggerEffects(deps[0], eventInfo)
      } else {
        triggerEffects(deps[0])
      }
    }
  } else {
    const effects: ReactiveEffect[] = []
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep)
      }
    }
    if (__DEV__) {
      triggerEffects(createDep(effects), eventInfo)
    } else {
      triggerEffects(createDep(effects))
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
```

## 核心方法

reactive shadowReactive

readonly shadowReadonly

toRaw（转原始对象） markRow（标记不能被代理，本质是加上\_v_skip）

自动拆包就是在 baseHandler 里判断如果是 ref 就返回 ref.value

除了 get 和 set 还有 3 个代理
当使用到 delete in for/in 这个三个的时候
分别对应 deleteProperty has ownKeys 代理

...toRefs 是把属性都拿出来使用，单个用

## 核心逻辑总结

通过 Proxy 代理对象，触发 setter 的时候通过 track 收集依赖到 WeakMap 里，改变数据的时候通过 trigger 触发依赖，找到之前的函数执行重新渲染页面
