## new

```js

function new(fn){

  // const newObj = {}
  // newObj.__proto__ = fn.prototype

  // 创建一个空对象隐式原型指向函数的显示原型
  const newObj = Object.create(fn.prototype)

  // 执行函数得到返回值
  const res = fn.apply(newObj,arguments)

  // 如果返回值是值类型直接返回，如果是引用类型返回newObj
  return typeof(res) === 'object' && res !== null ? res : newObj
}
```

## instanceof

```js
function instanceof(a,b){

  //  左边的隐式原型
  const l = a.__proto__

  // 右边的显示原型
  const r = b.prototype

  // 一直查找
  while(true){

    // 如果找完了还没有则为false
    if(l===null){
      return false
    }

    // 如果找到了则为true
    if(l === r){
      return true
    }

    // 查找
    l = l.__proto__
  }
}
```

## 深拷贝

```js
function deepClone(obj, cache = new WeakMap()) {
  // 首先不能拷贝基础数据类型
  if (typeof obj !== 'object' || obj === null) return

  // 如果能获取到缓存值
  if (cache.has(obj)) {
    return cache.get(obj)
  }

  // 定义一个拷贝的数据
  const target = obj instanceof Array ? [] : {}

  // 存
  cache.set(obj, target)

  for (let key in obj) {
    // for in会遍历原型上的属性，所以加hasOwnProperty
    if (obj.hasOwnProperty(key)) {
      // 递归
      target[key] = deepClone(obj[key], cache)
    }
  }

  return target
}
```

## 数组转树

```js
// 测试数据
const arr = [
  { id: '01', name: '张大大', pid: '', job: '项目经理' },
  { id: '02', name: '小亮', pid: '01', job: '产品leader' },
  { id: '03', name: '小美', pid: '01', job: 'UIleader' },
  { id: '04', name: '老马', pid: '01', job: '技术leader' },
  { id: '05', name: '老王', pid: '01', job: '测试leader' },
  { id: '06', name: '老李', pid: '01', job: '运维leader' },
  { id: '07', name: '小丽', pid: '02', job: '产品经理' },
  { id: '08', name: '大光', pid: '02', job: '产品经理' },
  { id: '09', name: '小高', pid: '03', job: 'UI设计师' },
  { id: '10', name: '小刘', pid: '04', job: '前端工程师' },
  { id: '11', name: '小华', pid: '04', job: '后端工程师' },
  { id: '12', name: '小李', pid: '04', job: '后端工程师' },
  { id: '13', name: '小赵', pid: '05', job: '测试工程师' },
  { id: '14', name: '小强', pid: '05', job: '测试工程师' },
  { id: '15', name: '小涛', pid: '06', job: '运维工程师' }
]

function ArrToTree(arr, id = 0) {
  const target = []

  arr.forEach((item) => {
    // 如果找到子item
    if (item.parentId === id) {
      // 递归传入整个数组和item.id去查子元素
      const children = ArrToTree(arr, item.id)

      if (children.length > 0) {
        item.children = children
      }

      target.push(item)
    }
  })

  return target
}
```

## 拍平数组

```js
// 测试数据
const a = [
  [1, 2],
  [3, 4],
  [2, 3, 4, [7, 4, 9]]
]

// 递归
function flat(arr) {
  const target = []
  arr.forEach((item) => {
    if (item instanceof Array) {
      target.push(...flat(item))
    } else {
      target.push(item)
    }
  })

  return target
}

// reduce
function flat(arr) {
  let res = arr.reduce((pre, next) => {
    return pre.concat(Array.isArray(next) ? flat(next) : next)
  }, [])
  return res
}
```

## 防抖

```js
function debounce(fn, time) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, time)
  }
}
```

## 节流

```js
function throttle(fn, time) {
  let old = 0 //0可以立即执行
  return function () {
    const timestamp = Date.now()
    if (timestamp - old > time) {
      fn.apply(this, arguments)
      old = timestamp
    }
  }
}
```

## 冒泡排序

## 快速排序

## 拖动

## 倒计时

## 抢红包

## 版本号排序

## 柯里化

## 响应式

## 推拽

## 字符串全排列

## promise

## useLatest

```js
const [count, setCount] = useState(1)

const useLatest = (value) => {
  const tarRef = useRef(value)
  console.log('first')
  tarRef.current = value
  return tarRef
}

const target = useLatest(count)

useEffect(() => {
  const interval = setInterval(() => {
    setCount(target.current + 1)
    console.log(target.current) /// 1
  }, 1000)
  return () => {
    clearInterval(interval)
  }
}, [])
```

## 反转链表

```js
function reverseLinkedList(head) {
  let prev = null
  let current = head

  while (current) {
    let next = current.next
    current.next = prev
    prev = current
    current = next
  }

  return prev
}
```

## 版本号排序

```js
function compareVersion(version1, version2) {
  const v1 = version1.split('.')
  const v2 = version2.split('.')

  const length = Math.max(v1.length, v2.length)

  for (let i = 0; i < length; i++) {
    const num1 = parseInt(v1[i] || 0)
    const num2 = parseInt(v2[i] || 0)

    if (num1 !== num2) {
      return num1 - num2
    }
  }

  return 0
}

function sortVersions(versions) {
  return versions.sort(compareVersion)
}

console.log(sortVersions(['0.1.2', '0.2.1', '0.0.1', '2.0.0', '1.0.221']))
```
