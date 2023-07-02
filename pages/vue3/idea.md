## Vue3 是一个声明式框架

更关注于结果

## Vue3 采用虚拟 dom

通过比较新旧虚拟 dom，找到变化更新

## Vue3 模块拆分的思想

在 Vue2 中很多方法可能用不到的都会挂在 Vue 实例上，不利于 Tree-shaking，Vue3 通过模块拆分的方式写成一个个的函数，可以用到了才引入，利于 Tree-shaking

## Vue3 采用 pnpm monorepo

一个仓库维护多个模块，不用到处去找仓库
方便版本管理和依赖管理，模块之前的引用，调用方便

## 其他优化

- 自定义渲染器扩展更方便
- RFC

## Vue3 中各个包的作用

![](https://cdn.nlark.com/yuque/0/2022/png/22629207/1656393802619-4fcf1952-35bd-42bc-b830-1968c1f34015.png)

## Vue2 和 Vue3 的区别？

我认为框架的升级主要有两点，一个是性能上的优化，一个是给开发者更好的开发体验

优化方面，响应式使用 proxy 代替 defineProperty，性能更高效监听范围更广，用到才执行是懒监听而不是一次直接递归监听；还有 diff 算法优化（静态节点优化，最长递增子序列），函数式模块化 Tree-shaking 减少包体积(Vue2 中大量 Api 放在 vue 对象的原型上不利于 Tree-shaking)

开发体验上面，setup（3.2）和 compositon api 解决了反复横跳问题；watchEffect 这种 api 还可以智能收集依赖；生命周期命名和合并优化；新增了 Teleport/Suspence 组件；函数式编程；TS 重构能更早发现问题

组件逻辑共享问题， Vue2 采用 mixins 实现组件之间的逻辑共享； 但是会有数据来源不明确，命名冲突等问题。 Vue3 采用 CompositionAPI 提取公共逻辑非常方便

## Vue2 中反复横跳问题

当一个组件逻辑比较多的时候，比如你正在找一个 data 里的数据，找完后要去 methods 或者 watch 去找下一个逻辑，那如果中间有很多代码，就会产生反复横跳问题

Vue3 中 3.2 版本前还没有 setup，这个版本前 template 模版里想用响应式数据，需要在 script 最后去 return 数据，那不是一样有反复横跳问题吗？所以我觉得在 3.2 版本之后 setup 有了后才能说彻底解决反复横跳问题

## Proxy 代替 Object.defineProperty

```js
// 创建目标对象
const target = {
  name: 'imber',
  age: 18
}

// 创建代理对象，用于劫持目标对象
const handler = {
  get(target, property) {
    // 在获取属性时，追加一段额外的逻辑
    console.log(`获取属性${property}`)
    return target[property]
  }
}

// 创建代理实例
const proxy = new Proxy(target, handler)

// 通过代理访问目标对象的属性
console.log(proxy.name) // 输出: 获取属性name  imber
console.log(proxy.age) // 输出: 获取属性age   18
```

可以看到 proxy 只需要劫持整个对象，不用递归劫持，且能支持 get 和 set 还能劫持 has/delete 等

```js
// 创建目标对象
const target = {
  name: 'Alice',
  age: 25,
  address: {
    city: 'London',
    country: 'UK'
  }
}

// 递归实现劫持
function recursiveHijack(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      recursiveHijack(obj[key])
    }
    let value = obj[key]
    Object.defineProperty(obj, key, {
      get() {
        // 在访问属性时，追加一段额外的逻辑
        console.log(`获取属性${key}`)
        return value
      },
      set(newValue) {
        // 在设置属性时，追加一段额外的逻辑
        console.log(`设置属性${key}为${newValue}`)
        value = newValue
      }
    })
  }
}

// 递归劫持目标对象
recursiveHijack(target)

// 访问目标对象的属性
console.log(target.name) // 输出: 获取属性name  Alice
console.log(target.age) // 输出: 获取属性age  25
console.log(target.address.city) // 输出: 获取属性city  London

// 设置目标对象的属性
target.name = 'Bob' // 输出: 设置属性name为Bob
target.age = 30 // 输出: 设置属性age为30
target.address.city = 'New York' // 输出: 设置属性city为New York
```

如果使用 defineProperty，不能劫持对象，只能劫持对象的属性，需要递归劫持
当新增属性和删除属性时无法监控变化。需要通过$set、$delete 实现
Vue2 中数组不采用 defineProperty 来进行劫持 （浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理
