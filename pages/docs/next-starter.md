## 1、初始化项目

npx create-next-app@latest

![img](https://cdn.nlark.com/yuque/0/2023/png/22629207/1688112191278-9d8aa72d-d65e-4e57-a8b3-86305c3231d8.png)

用最新的 app + page 目录模式

在 app 目录下的组件默认都是 React Server Components，可以通过 suspense 流渲染，多个 suspense 是并行的

默认使用 npm、直接删了 package-lock.json 然后 `sudo pnpm i`

## 配置 tailwindcss

https://www.tailwindcss.cn/docs/guides/nextjs

选择最新的几个选项

## 2、安装需要的依赖

```js
pnpm i -D prettier prettier-plugin-tailwindcss
```

## 3、配置.vscode>settings.json

```js
{
  "typescript.tsdk": "node_modules/typescript/lib", //使用项目的ts版本
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true, // 每次保存的时候将代码按照 eslint 格式进行修复
    "source.fixAll.stylelint": true //自动格式化stylelint
  },
  "editor.formatOnSave": true, //自动格式化
  "editor.defaultFormatter": "esbenp.prettier-vscode" //风格用prettier
}
```

## 4、prettier.json

```js
{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "none",
  "tabWidth": 2,
  "printWidth": 80,
  "arrowParens": "avoid",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## 4、.prettierignore

.next
pnpm-lock.yaml

## 5、eslintrc.json 增加规则

```js

```

## next 多语言

# ---------- 布局 LAYOUTS ----------

## 嵌套布局（Nested Layouts）

布局是在多个页面之间共享的 UI。在导航，布局保持状态，保持交互，不重新渲染。两个或者更多的布局也可以嵌套。
像 spa 的路由一样，layout 不用变化，只变化 outlet。也就是解决了 page router 的持久化缓存问题。
layout 里面还可以导出 metadata 作为页面 TDK

```js
export const metadata = {
  title: 'Nested Layouts',
  description: 'xxxxxx'
}
```

注意 template.tsx 也支持套一层，但不能持久化和设置 header 等

## 嵌套布局（Grouped Layouts）

可以支持同级路由下用不用 layout，文件夹的名字用小括号包起来，最外层有个普通的 layout，默认使用`(main)`作为入口

# ---------- 文件约定 File Conventions ----------

## 加载中（Loading）

也就是 loading.tsx，像 layout 一样可以复用，如果 fetch 设置成`no-cache`，请求完一次后页面被缓存，如果是`no-store`就不会缓存

## 错误（Error）

error.tsx

## 找不到页面（Not Found）

not-found.tsx

# ---------- 获取数据 File Conventions ----------

## Suspence 流式渲染（Streaming with Suspense）

流式传输允许您逐步渲染 UI 单元并将其从服务器发送到客户端。
这允许用户在加载其余内容时查看页面最重要的部分并与之交互，而不是等待整个页面加载然后才能与任何内容交互。
流式传输适用于 Edge 和 Node 运行时。
通过在上面的导航中选择运行时来尝试进行流式传输。

## 静态数据（Static Data）SSG

通过 generateStaticParams 只生成 1 和 2 的帖子，其他的按需生成

```js
import { RenderingInfo } from '#/ui/rendering-info'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  // Generate two pages at build time and the rest (3-100) on-demand
  return [{ id: '1' }, { id: '2' }]
}

export default async function Page({ params }: { params: { id: string } }) {
  if (Number(params.id) >= 100) {
    notFound()
  }

  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${params.id}`
  )
  const data = (await res.json()) as { title: string; body: string }

  const isOnDemand = Number(params.id) >= 3

  return (
    <div className="grid grid-cols-6 gap-x-6 gap-y-3">
      <div className="col-span-full space-y-3 lg:col-span-4">
        <h1 className="truncate text-2xl font-medium capitalize text-gray-200">
          {data.title}
        </h1>
        <p className="font-medium text-gray-500 line-clamp-3">{data.body}</p>
      </div>
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2">
        <RenderingInfo type={isOnDemand ? 'ssgod' : 'ssg'} />
      </div>
    </div>
  )
}

```

\_component

import { cookies } from 'next/headers'

Number(cookies().get('\_cart_count')?.value || '0')

loading suspence

## 动态数据(Dynamic Data)SSR

普通 async 和 await

## Edge 和 Node.js 运行时

## 增量式渲染（Incremental Static Regeneration）ISR

需要导出一个 dynamicParams，然后配置 fetch 的`{ next: { revalidate: 10 } }`

```js
import { RenderingInfo } from '#/ui/rendering-info'

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
      <div className="-order-1 col-span-full lg:order-none lg:col-span-2">
        <RenderingInfo type="isr" />
      </div>
    </div>
  )
}

```

在服务器上，有两个运行时可以渲染页面：

Node.js 运行时（默认）可以访问生态系统中的所有 Node.js API 和兼容包。
Edge Runtime 基于 Web API。
两个运行时都支持来自服务器的流式传输，具体取决于您的部署基础架构。

要了解如何在运行时之间切换，请参阅 Edge 和 Node.js 运行时页面。

## suspense 和 loading

suspense 是多个子组件请求
loading 是整个页面
