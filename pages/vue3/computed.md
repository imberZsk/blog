## computed 的使用

```js
import { effect, reactive, computed } from '../../dist/mini-vue.esm-bundler.js'

const person = {
  firstName: 'z',
  lastName: 'kun'
}

const proxy = reactive(person)

//创建computedRefImpl,存了很多东西,computed setter也有
const fullName = computed(() => {
  return proxy.firstName + proxy.lastName //proxy 收集依赖
})

// const fullName = computed({
//   getter: () => {
//   },
//   setter: () => {}
// })

//创建一个ReactiveEffect,执行一次函数
effect(() => {
  document.querySelector('.app').innerHTML = fullName.value //computedRefImpl 收集依赖,会执行一次上面的函数拿到值
})

setTimeout(() => {
  proxy.firstName = 'imber' //proxy 触发依赖
}, 1000)
```

## 返回一个 computedRefImpl 实例

有 getter 和 setter 和 dep 和\_value 和 effect
会创建一个 ReactiveEffect 放到 this.effect 上，从这个时候就收集了 effect 依赖(注意 proxy 也收集了 computed 函数里的 callback 依赖也就是 targetMap->proxy->firstName->ReactiveEffect)

```js
export function computed<T>(
  getter: ComputedGetter<T>,
  debugOptions?: DebuggerOptions
): ComputedRef<T>
export function computed<T>(
  options: WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions
): WritableComputedRef<T>
export function computed<T>(
  getterOrOptions: ComputedGetter<T> | WritableComputedOptions<T>,
  debugOptions?: DebuggerOptions,
  isSSR = false
) {
  let getter: ComputedGetter<T>
  let setter: ComputedSetter<T>

  const onlyGetter = isFunction(getterOrOptions)
  if (onlyGetter) {
    getter = getterOrOptions
    setter = __DEV__
      ? () => {
          console.warn('Write operation failed: computed value is readonly')
        }
      : NOOP
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR)

  if (__DEV__ && debugOptions && !isSSR) {
    cRef.effect.onTrack = debugOptions.onTrack
    cRef.effect.onTrigger = debugOptions.onTrigger
  }

  return cRef as any
}

export class ComputedRefImpl<T> {
  public dep?: Dep = undefined

  private _value!: T
  public readonly effect: ReactiveEffect<T>

  public readonly __v_isRef = true
  public readonly [ReactiveFlags.IS_READONLY]: boolean = false

  public _dirty = true
  public _cacheable: boolean

  constructor(
    getter: ComputedGetter<T>,
    private readonly _setter: ComputedSetter<T>,
    isReadonly: boolean,
    isSSR: boolean
  ) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
    this.effect.active = this._cacheable = !isSSR
    this[ReactiveFlags.IS_READONLY] = isReadonly
  }

  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()!
    }
    return self._value
  }

  set value(newValue: T) {
    this._setter(newValue)
  }
}
```

## effect 函数执行触发 getter

getter 执行会调用当前 effect，然后通过 return this.effect.run()取值

```js
  get value() {
    // the computed ref may get wrapped by other proxies e.g. readonly() #3376
    const self = toRaw(this)
    trackRefValue(self)
    if (self._dirty || !self._cacheable) {
      self._dirty = false
      self._value = self.effect.run()!
    }
    return self._value
  }

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
    dep.add(activeEffect!)
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

## 触发代理对象 的 setter

ComputedRefImpl 就是一个 effect，通过 scheduler 触发的 proxy 依赖，初始为 dirty，然后执行后为 false 就不用重新执行了取之前的数据，数据改变 scheduler 里把数据变为 true 然后又能执行
setter 是走正常的 setter,而不是走 ComputedRefImpl 的 setter,computed 不支持修改生成的数据
