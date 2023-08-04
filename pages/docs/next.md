title: Next13 项目总结

部门是官网部，做 C 端项目需要 SEO，用到 Nextjs，今年上半年有两个项目使用 Next13 开发的，一个是集团官网，一个是活动 h5，使用到了 Next13 最新写法 app router

## 项目技术栈

集团官网技术栈

- 响应式布局
- next13 + react18 + ts
- pages router
- GSAP
- threejs
- 多语言
- 项目规范: Prettier Eslint Husky Lint-staged Commitlint axios tailwind
- 其他库：swiper、vanilla-tilt

活动 h5 技术栈

- 自适应布局
- app router
- next13 + react18 + ts + fetch
- 项目规范: Prettier Eslint Husky Lint-staged Commitlint tailwind
- 其他库：swiper、js-cookie、vconsole

## 收获

能 hold 住项目规范，eslint 和 prettier 有自己喜欢的一套规则，提交规范用的默认的一套，感觉是够了，后面可能会考虑 git-simple-hook

使用 hooks 越来越优雅，除了封装常用的逻辑 hook，还封装了 10+动画 hook，页面全做 hook 逻辑抽离，优雅～

熟练了 app router， 虽然刚开始有挺多约束,比如要分客户端组件和服务端组件，又比如新的一套 SSR/SSG/ISR 写法；但它提供的东西是真的香

对 GSAP 更加熟练，封装了一些动画 hook;GSAP 就是一个动画库国内用得是比较多的，比 react spring 和 framer-motion 强大，也很丝滑，但是在小项目下，还是多尝试 react spring 和 framer-motion

习惯，掌握 tailwind，项目越大，减少的 css 体积越多，主题切换和响应式基本没有心智负担，太香～，推广过后，同事也都爱不释手

fetch 的使用，网上很多有说 axios 过渡封装的事情，自己也封装过，感觉确实没必要，fetch 其实也没必要，另外 fetch 在 next 中可以配置些 next 能懂的配置，比如`{ next: { revalidate: 10 } }`

更加熟悉 Next+ts 中 ts 的写法，其实基本都是 React 的，项目也是@types/react 和@types/react-dom，一些 Next 内置类型，通过 vscode 插件 Nextjs snippets 熟悉

入门了一点点 threejs，项目里有 threejs 加模型的页面，同事开发的，通过这个案例在加上后面学习了一点 threejs，算入了一点点门吧，最近我们部门会帮别的部门做一个 XR 相关的网页可能是官网，需要 threejs，正好可以实践一下

## 项目规范

一开始做项目的时候，初始化完了之后，会发现默认模版是不太规范的，比如项目里没有使用的变量没有提示报错，使用了 any 没有提示报错等，这个时候就需要在原来的基础上增加一些 eslint 规则来规范项目

一些风格用 prettier 统一，因为使用的是 tailwind，所以用 prettier-plugin-tailwindcss 统一风格

使用 Husky Lint-staged Commitlint 来统一提交规范

npmrc 里指定淘宝镜像

node 的版本配置一下 engines

然后需要一份封装好的 axios，在做集团官网的时候使用的 axios 但 next 和 fetch 更契合，后面 h5 项目抛弃了 axios

这样一个项目就有了，当然，这个 stater 应该保存一份到公司仓库

## 响应式布局和自适应布局

现在基本都是响应式布局而不是写两套代码，不过记得要求 UI 多出个平板电脑和 h5 的设计稿

## 强大的 app router

#### 嵌套 layout

写 spa 的时候，页面的头部有几个切换按钮在 header 组件，从一个按钮到点击另一个按钮，我们知道 header 是不会刷新的，但是以前的 nextjs 居然会刷新，而且每个 tab 都是新页面，一句卧槽～，Next13 的 app router 就解决了这个持久化缓存问题，不刷新 layout 部分，并支持嵌套 layout

还有个问题，如果我的一个页面，有它单独的几个组件和一个 type.ts，那我肯定想它能在当前目录下，就近原则方便查找，又一句卧槽，以前的版本居然不能放当前 pages 里，因为会跟约定式路由冲突，现在 app 路由里才行，使用 pages.tsx 当页面区分，当前页面可以\_component 当组件目录

#### RSC 流式渲染

app 目录下组件默认都是 RSC，(React Server Components)，组件外可以包一层 Suspence，就能流式渲染

外层组件

```js
import { Suspense } from 'react'
import Demo from './_component/demo'

const Test = async () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Demo />
    </Suspense>
  )
}

export default Test
```

Suspence 包裹的组件

```js
const Demo: React.FC = async () => {
  const res = await fetch('http://localhost:3300/data1', { cache: 'no-store' })
  const data = await res.json()
  return (
    <div>
      <div>{data.data}</div>
    </div>
  )
}

export default Demo
```

这样有什么好处呢？

比如我有一个页面有 10 多个模块，每个模块通过不同接口请求数据来渲染，在以前的版本，页面会每个模块请求完全部生成后才返回页面，这样是不合理的，如果能哪个模块请求并且组装完了就显示，其他模块 loading,这样不就快很多嘛，RSC 就实现了这一点，通过 fallback 指定 loading

#### 约束文件

整个页面在加载的时候，我们希望能 loading，这个时候，直接跟 pages 同级建一个 loading.tsx 就实现了，同理还有 not-found.tsx，error.tsx 等

## SSR/SSG/ISR

#### SSR

组件使用 async，然后里面一个 await 请求就可以 SSR 了，build 成功后会看到页面是哪一种

```js
const Demo: React.FC = async () => {
  const res = await fetch('http://localhost:3300/data1', { cache: 'no-store' })
  const data = await res.json()
  return (
    <div>
      <div>{data.data}</div>
    </div>
  )
}

export default Demo
```

#### SSG

SSG 需要使用 generateStaticParams

```js
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }]
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log(params)
  const res = await fetch(`http://localhost:3300/data2/${params.id}`, {
    cache: 'no-store'
  })
  const data = await res.json()

  return <div>{data.data}</div>
}
```

#### ISR

ISR 比 SSG 多一个 dynamicParams

```js
export const dynamicParams = true

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function Page({ params }: { params: { id: string } }) {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`,
    { next: { revalidate: 10 } }
  )
  const data = (await res.json()) as { title: string; body: string }

  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {data.title}
        </h1>
        <p className="font-medium text-gray-500">{data.body}</p>
      </div>
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2"></div>
    </div>
  )
}
```

## 图片优化

sharp 都处理成了 webp，都有 memory cache 原生懒加载 lazy loading

## 资源缓存

除了 html，都会走强缓存 cache control (disk cache)

## 环境变量

nextjs 默认环境变量只能给服务端，客户端需要 NEXT_PUBLIC
所以常用

```js
NEXT_PUBLIC_BASE_URL=/api
```

## 代理

## sitemap

app/sitemap.tsx

```js
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://citywalk.meizu.cn',
      lastModified: new Date()
    },
    {
      url: 'https://citywalk.meizu.cn/verify',
      lastModified: new Date()
    }
  ]
}
```

## RSC

非交互的组使用服务器组件，初始页面加载速度更快，并且客户端 JavaScript 包大小减小

在应用程序中使用客户端交互性时，才会添加其他 JavaScript

默认服务端组件在服务端渲染完成，使用'use client'当作客户端组件在服务器上预渲染并在客户端上进行水化，也就是说客户端组件部分 hydrated，选择性注水，也就是服务端组件不用水合（服务端组件服务端渲染完成，客户端组件在服务端预渲染然后客户端注水）

虽然不能在客户端组件里使用服务端组件，不过可以通过 children props 插槽的方式，这样可以拆更细

RSC 不支持 context 服务器组件不是交互式的

Next 直接连接数据库

```js
import { usePathname } from 'next/navigation'
const pathname = usePathname()
```

router.prefetch()：该 useRouter 钩子可用于以编程方式预取路由。

fetch 用于服务端请求，react-query 和 swr 用于客户端

generateStaticParams 可以在构建时静态生成路由

## 选择性水合

使用 SSR，在用户可以查看页面并与页面交互之前需要完成一系列步骤：

首先，在服务器上获取给定页面的所有数据。
然后服务器呈现该页面的 HTML。
页面的 HTML、CSS 和 JavaScript 将发送到客户端。
使用生成的 HTML 和 CSS 显示非交互式用户界面。
最后，反应水合物用户界面使其具有交互性。

这些步骤是连续的和阻塞的，这意味着服务器只能在获取所有数据后才能呈现页面的 HTML。而且，在客户端，只有下载了页面中所有组件的代码后，React 才能对 UI 进行水合。

结合 React 和 Next.js 的 SSR 通过尽快向用户显示非交互式页面来帮助提高感知加载性能

流式传输允许您将页面的 HTML 分解为更小的块，并逐步将这些块从服务器发送到客户端

https://nextjs.org/_next/image?url=%2Fdocs%2Fdark%2Fserver-rendering-with-streaming.png&w=3840&q=75&dpl=dpl_H1LQCiRipv61gLuhmuJepgzeSCmK

这使得页面的某些部分能够更快地显示，而无需等待所有数据加载后才能呈现任何 UI。

通过使用 Suspense，您可以获得以下好处：

流式服务器渲染- 逐步将 HTML 从服务器渲染到客户端。
选择性水合- React 根据用户交互优先考虑哪些组件首先进行交互。

`import { NextResponse } from 'next/server'` route.ts
`import { cookies } from 'next/headers'`
`import { headers } from 'next/headers'`
`export const revalidate = 60`
`import { redirect } from 'next/navigation'`
