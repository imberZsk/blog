#### 初始化项目

- vscode 里下好插件：eslint，prettier，stylelint

- 官网模版创建项目：`pnpm create vite react-starter --template react-swc-ts`

- 安装依赖：`pnpm i`

- 后面有可能遇到 ts 类型错误，可以提前安装一个`pnpm i @types/node -D`

#### 配置 npm 使用淘宝镜像

- 配置`npmrc`

  ```
  registry = "https://registry.npmmirror.com/"
  ```

#### 配置 node 版本限制提示

- package.json 中配置

  ```json
  "engines": {
    "node": ">=16.0.0"
  },
  ```

#### 配置 eslint 检查代码规范

> eslint 处理代码规范,prettier 处理代码风格
> eslint 选择只检查错误不处理风格，这样 eslint 就不会和 prettier 冲突
> react 官网有提供一个 hook 的 eslint (eslint-plugin-react-hooks)，用处不大就不使用了

- 安装：`pnpm i eslint -D`

- 生成配置文件：`eslint --init`

  ```json
  - To check syntax and find problems
  - JavaScript modules (import/export)
  - React
  - YES
  - Browser
  - JSON
  - Yes
  - pnpm
  ```

- 配置`eslintrc.json->rules`里配置不用手动引入 react，和配置不可以使用 any
- 注意使用 React.FC 的时候如果报错说没有定义 props 类型，那需要引入一下 react

  ```json
  "rules": {
    //不用手动引入react
    "react/react-in-jsx-scope": "off",
    //使用any不报错
    "@typescript-eslint/no-explicit-any": "error",
  }
  ```

- 工作区配置`.vscode>settings.json`，配置后 vscode 保存时自动格式化代码风格

  比如写了一个 var a = 100,会被自动格式化为 const a = 100

  ```json
  {
    "editor.codeActionsOnSave": {
      // 每次保存的时候将代码按照 eslint 格式进行修复
      "source.fixAll.eslint": true,
      //自动格式化
      "editor.formatOnSave": true
    }
  }
  ```

- 配置`.eslintignore`，eslint 会自动过滤 node_modules

  ```json
  dist
  ```

- 掌握`eslint格式化命令`，后面使用 lint-staged 提交代码的时候需要配置

  为什么上面有 vscode 自动 eslint 格式化，还需要命令行: 因为命令行能一次性爆出所有警告问题，便于找到位置修复

  ```js
  npx eslint . --fix//用npx使用项目里的eslint,没有的话也会去使用全局的eslint
  eslint . --fix //全部类型文件
  eslint . --ext .ts,.tsx --fix //--ext可以指定文件后缀名s
  ```

  eslintrc.json 里配置

- ```js
  "env": {
    "browser": true,
    "es2021": true,
    "node": true // 因为比如配置vite的时候会使用到
  },
  ```

#### 配置 prettier 检查代码风格

> prettier 格式化风格，因为使用 tailwind，使用 tailwind 官方插件

- 安装：`pnpm i prettier prettier-plugin-tailwindcss -D`

- 配置`.prettierrc.json`

  注释要删掉，prettier 的配置文件 json 不支持注释

  ```json
  {
    "singleQuote": true, // 单引号
    "semi": false, // 分号
    "trailingComma": "none", // 尾随逗号
    "tabWidth": 2, // 两个空格缩进
    "plugins": ["prettier-plugin-tailwindcss"] //tailwind插件
  }
  ```

- 配置`.prettierignore`

  ```
  dist
  pnpm-lock.yaml
  ```

- 配置`.vscode>settings.json`，配置后 vscode 保存时自动格式化代码风格

  ```json
  {
    "editor.codeActionsOnSave": {
      // 每次保存的时候将代码按照 eslint 格式进行修复
      "source.fixAll.eslint": true
    },
    //自动格式化
    "editor.formatOnSave": true,
    //风格用prettier
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
  ```

- 掌握`prettier命令行`

  可以让之前没有格式化的错误一次性暴露出来

  ```js
  npx prettier --write .//使用Prettier格式化所有文件
  ```

#### 配置 husky 使用 git hook

> 记得要初始化一个 git 仓库，husky 能执行 git hook，在 commit 的时候对文件进行操作

- 安装

  `sudo pnpm dlx husky-init`

  ` pnpm install`

  `npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'`，commit-msg 使用 commitlint

  `npx husky add .husky/pre-commit "npm run lint-staged"`，pre-commit 使用 lint-staged

#### 配置 commitlint 检查提交信息

> 提交规范参考：https://www.conventionalcommits.org/en/v1.0.0/

- 安装`pnpm i @commitlint/cli @commitlint/config-conventional -D`

- 配置`.commitlintrc.json`

  ```
  { extends: ['@commitlint/config-conventional'] }
  ```

#### 配置 lint-staged 增量式检查

- 安装`pnpm i -D lint-staged `

- 配置`package.json`

  ```json
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "prepare": "husky install",
    "lint-staged": "npx lint-staged"//新增，对应上面的husky命令
  },
  ```

- 配置`.lintstagedrc.json`

  ```json
  {
    "*.{ts,tsx,json}": ["prettier --write", "eslint --fix"],
    "*.css": ["stylelint --fix", "prettier --write"]
  }
  ```

#### 配置 vite（代理/别名/drop console 等）

> 如果有兼容性考虑，需要使用 legacy 插件，vite 也有 vscode 插件，也可以下载使用

- 一些方便开发的配置

  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react-swc'
  import path from 'path'

  // https://vitejs.dev/config/
  export default defineConfig({
    esbuild: {
      drop: ['console', 'debugger']
    },
    css: {
      // 开css sourcemap方便找css
      devSourcemap: true
    },
    plugins: [react()],
    server: {
      // 自动打开浏览器
      open: true，
      proxy: {
        '/api': {
          target: 'https://xxxxxx',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    resolve: {
      // 配置别名
      alias: { '@': path.resolve(__dirname, './src') }
    },
    //打包路径变为相对路径,用liveServer打开,便于本地测试打包后的文件
    base: './'
  })
  ```

- 配置打包分析，用 legacy 处理兼容性

  `pnpm i rollup-plugin-visualizer -D`

  `pnpm i @vitejs/plugin-legacy -D`，实际遇到了再看官网用

  ```js
  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react-swc'
  import { visualizer } from 'rollup-plugin-visualizer'
  import legacy from '@vitejs/plugin-legacy'
  import path from 'path'
  // https://vitejs.dev/config/
  export default defineConfig({
    css: {
      // 开css sourcemap方便找css
      devSourcemap: true
    },
    plugins: [
      react(),
      visualizer({
        open: false // 打包完成后自动打开浏览器，显示产物体积报告
      }),
      //考虑兼容性，实际遇到了再看官网用
      legacy({
        targets: ['ie >= 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime']
      })
    ],
    server: {
      // 自动打开浏览器
      open: true
    },
    resolve: {
      // 配置别名
      alias: { '@': path.resolve(__dirname, './src') }
    },
    //打包路径变为相对路径,用liveServer打开,便于本地测试打包后的文件
    base: './'
  })
  ```

- 如果想手机上看网页，可以`pnpm dev --host`

- 如果想删除 console，可以按`h`去 help 帮助，再按`c`就可以 clear console

#### 配置 tsconfig

- tsconfig.json 需要支持别名

  ```json
  {
    "compilerOptions": {
      "target": "ESNext",
      "useDefineForClassFields": true,
      "lib": ["DOM", "DOM.Iterable", "ESNext"],
      "allowJs": false,
      "skipLibCheck": true,
      "esModuleInterop": false,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "forceConsistentCasingInFileNames": true,
      "module": "ESNext",
      "moduleResolution": "Node",
      "resolveJsonModule": true,
      "isolatedModules": true,
      "noEmit": true,
      "jsx": "react-jsx",
      "baseUrl": "./",
      "paths": {
        "@/*": ["src/*"]
      }
    },
    "include": ["src"],
    "references": [{ "path": "./tsconfig.node.json" }]
  }
  ```

#### 配置 router

- 安装：`pnpm i react-router-dom`

- 配置`router->index.ts`

  ```js
  import { lazy } from 'react'
  import { createBrowserRouter } from 'react-router-dom'
  const Home = lazy(() => import('@/pages/home'))
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home></Home>
    }
  ])
  export default router
  ```

- 配置`main.tsx`

  ```tsx
  import { RouterProvider } from 'react-router-dom'
  import ReactDOM from 'react-dom/client'
  import './global.css'
  import router from './router'

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <RouterProvider router={router} />
  )
  ```

#### 配置 zustand 状态管理

- 安装`pnpm i zustand `

- store->index.ts

  ```js
  import { create } from 'zustand'

  interface appsState {
    nums: number
    setNumber: (nums: number) => void
  }

  const useAppsStore = create<appsState>((set) => ({
    nums: 0,
    setNumber: (num) => {
      return set(() => ({
        nums: num
      }))
    }
  }))

  export default useAppsStore
  ```

- 使用方法

  ```js
  import Button from '@/comps/custom-button'
  import useAppsStore from '@/store/app'
  const ZustandDemo: React.FC = () => {
    const { nums, setNumber } = useAppsStore()
    const handleNum = () => {
      setNumber(nums + 1)
    }
    return (
      <div className="p-10">
        <h1 className="my-10">数据/更新</h1>
        <Button click={handleNum}>点击事件</Button>
        <h1 className="py-10">{nums}</h1>
      </div>
    )
  }

  export default ZustandDemo
  ```

#### 配置 antd

- 新版本的 antd，直接下载就可以用，如果用到它的图片再单独下载`pnpm i antd`
- 注意 antd5 版本的 css 兼容性不好，如果项目有兼容性要求，需要去单独配置

#### 配置 Tailwind css

`pnpm i tailwindcss autoprefixer postcss `

tailwind.config.cjs

```js
// 打包后会有1kb的css用不到的，没有影响
// 用了antd组件关系也不大，antd5的样式是按需的
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // colors: {
      //   themeColor: '#ff4132',
      //   textColor: '#1a1a1a'
      // },
      // 如果写自适应布局，可以指定设计稿为1000px,然后只需要写/10的数值
      // fontSize: {
      //   xs: '3.3vw',
      //   sm: '3.9vw'
      // }
    }
  },
  plugins: []
}
```

postcss.config.cjs

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
}
```

我喜欢新建一个 apply.css 引入到全局

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

.margin-center {
  @apply mx-auto my-0;
}

.flex-center {
  @apply flex justify-center items-center;
}

.absolute-center {
  @apply absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2;
}
```

#### 封装 fetch 请求

> 这个封装仅供参考，TS 类型有点小问题

```js
// 可以传入这些配置
interface BaseOptions {
  method?: string
  credentials?: RequestCredentials
  headers?: HeadersInit
  body?: string | null
}

// 请求方式
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'

// 第一层出参
interface ResponseObject {
  ok: boolean
  error: boolean
  status: number
  contentType: string | null
  bodyText: string
  response: Response
}

// 请求头类型
type JSONHeader = {
  Accept: string
  'Content-Type': string
}

// 创建类
class Request {
  private baseOptions: BaseOptions = {}

  // 根据传入的 baseOptions 做为初始化参数
  constructor(options?: BaseOptions) {
    this.setBaseOptions(options || {})
  }

  public setBaseOptions(options: BaseOptions): BaseOptions {
    this.baseOptions = options
    return this.baseOptions
  }

  // 也提供获取 baseOption 的方法
  public getBaseOptions(): BaseOptions {
    return this.baseOptions
  }

  // 核心请求 T 为入参类型，ResponseObject 为出参类型
  public request<T>(
    method: HttpMethod,
    url: string,
    data?: T, //支持使用get的时候配置{key,value}的query参数
    options?: BaseOptions //这里也有个 base 的 method
  ): Promise<ResponseObject> {
    // 默认 baseOptions
    const defaults: BaseOptions = {
      method
      // credentials: 'same-origin'
    }

    // 收集最后要传入的配置
    const settings: BaseOptions = Object.assign(
      {},
      defaults,
      this.baseOptions,
      options
    )

    // 如果 method 格式错误
    if (!settings.method || typeof settings.method !== 'string')
      throw Error('[fetch-json] HTTP method missing or invalid.')

    // 如果 url 格式错误
    if (typeof url !== 'string')
      throw Error('[fetch-json] URL must be a string.')

    // 支持大小写
    const httpMethod = settings.method.trim().toUpperCase()

    // 如果是GET
    const isGetRequest = httpMethod === 'GET'

    // 请求头
    const jsonHeaders: Partial<JSONHeader> = { Accept: 'application/json' }

    // 如果不是 get 设置请求头
    if (!isGetRequest && data) jsonHeaders['Content-Type'] = 'application/json'

    // 收集最后的headers配置
    settings.headers = Object.assign({}, jsonHeaders, settings.headers)

    // 获取query参数的key
    const paramKeys = isGetRequest && data ? Object.keys(data) : []

    // 获取query参数的值
    const getValue = (key: keyof T) => (data ? data[key] : '')

    // 获取query key=value
    const toPair = (key: string) =>
      key + '=' + encodeURIComponent(getValue(key as keyof T) as string)

    // 生成 key=value&key=value 的query参数
    const params = () => paramKeys.map(toPair).join('&')

    // 收集最后的 url 配置
    const requestUrl = !paramKeys.length
      ? url
      : url + (url.includes('?') ? '&' : '?') + params()

    // get没有body
    settings.body = !isGetRequest && data ? JSON.stringify(data) : null

    // 做一层res.json()
    const toJson = (value: Response): Promise<ResponseObject> => {
      // 拿到第一次请求的值
      const response = value

      const contentType = response.headers.get('content-type')
      const isJson = !!contentType && /json|javascript/.test(contentType)

      const textToObj = (httpBody: string): ResponseObject => ({
        ok: response.ok,
        error: !response.ok,
        status: response.status,
        contentType: contentType,
        bodyText: httpBody,
        response: response
      })

      const errToObj = (error: Error): ResponseObject => ({
        ok: false,
        error: true,
        status: 500,
        contentType: contentType,
        bodyText: 'Invalid JSON [' + error.toString() + ']',
        response: response
      })

      return isJson
        ? // 如果是json,用json()
          response.json().catch(errToObj)
        : response.text().then(textToObj)
    }

    // settings做一下序列化
    const settingsRequestInit: RequestInit = JSON.parse(
      JSON.stringify(settings)
    )

    // 最终请求fetch,再通过then就能取到第二层res
    return fetch(requestUrl, settingsRequestInit).then(toJson)
  }

  public get<T>(
    url: string,
    params?: T,
    options?: BaseOptions
  ): Promise<ResponseObject> {
    return this.request<T>('GET', url, params, options)
  }

  public post<T>(
    url: string,
    resource: T,
    options?: BaseOptions
  ): Promise<ResponseObject> {
    return this.request<T>('POST', url, resource, options)
  }

  public put<T>(
    url: string,
    resource: T,
    options?: BaseOptions
  ): Promise<ResponseObject> {
    return this.request<T>('PUT', url, resource, options)
  }

  public patch<T>(
    url: string,
    resource: T,
    options?: BaseOptions
  ): Promise<ResponseObject> {
    return this.request<T>('PATCH', url, resource, options)
  }

  public delete<T>(
    url: string,
    resource: T,
    options?: BaseOptions
  ): Promise<ResponseObject> {
    return this.request<T>('DELETE', url, resource, options)
  }
}

const request = new Request()

export { request, Request }

```

#### 如果用 axios 请求

request.ts

```ts
import axios from 'axios'
import { AxiosInstance } from 'axios'
import { errorHandle, processData, successHandle } from './resInterceptions'
import { defaultRequestInterception } from './reqInterceptions'
const TIMEOUT = 5 * 1000

class Request {
  instance: AxiosInstance
  constructor() {
    this.instance = axios.create()
    this.init()
  }

  private init() {
    this.setDefaultConfig()
    this.reqInterceptions()
    this.resInterceptions()
  }
  private setDefaultConfig() {
    this.instance.defaults.baseURL = import.meta.env.VITE_BASE_URL
    this.instance.defaults.timeout = TIMEOUT
  }
  private reqInterceptions() {
    this.instance.interceptors.request.use(defaultRequestInterception)
  }
  private resInterceptions() {
    this.instance.interceptors.response.use(processData)
    this.instance.interceptors.response.use(successHandle, errorHandle)
  }
}

export default new Request().instance
```

reqInterceptions.ts

```ts
import type { InternalAxiosRequestConfig } from 'axios'

const defaultRequestInterception = (config: InternalAxiosRequestConfig) => {
  // TODO: 全局请求拦截器: 添加token
  return config
}

export { defaultRequestInterception }
```

resInterceptions.ts

```tsx
import { AxiosError, AxiosResponse } from 'axios'
import { checkStatus } from './checkStatus'

const processData = (res: AxiosResponse) => {
  // TODO:统一处理数据结构
  return res.data
}

const successHandle = (res: AxiosResponse) => {
  // TODO:处理一些成功回调，例如请求进度条
  return res.data
}

const errorHandle = (err: AxiosError) => {
  if (err.status) checkStatus(err.status)
  else return Promise.reject(err)
}

export { processData, successHandle, errorHandle }
```

checkStatus.ts

```ts
export function checkStatus(status: number, msg?: string): void {
  let errMessage = ''

  switch (status) {
    case 400:
      errMessage = `${msg}`
      break
    case 401:
      break
    case 403:
      errMessage = ''
      break
    // 404请求不存在
    case 404:
      errMessage = ''
      break
    case 405:
      errMessage = ''
      break
    case 408:
      errMessage = ''
      break
    case 500:
      errMessage = ''
      break
    case 501:
      errMessage = ''
      break
    case 502:
      errMessage = ''
      break
    case 503:
      errMessage = ''
      break
    case 504:
      errMessage = ''
      break
    case 505:
      errMessage = ''
      break
    default:
  }
  if (errMessage) {
    // TODO:错误提示
    // createErrorModal({title: errMessage})
  }
}
```

api.ts

```ts
import request from '@/services/axios/request'
import { ReqTitle } from './type'

export const requestTitle = (): Promise<ReqTitle> => {
  return request.get('/api/一个获取title的接口')
}
```

type.ts

```ts
export type ReqTitle = {
  title: string
}
```

#### 配置 mobx（可不用）

- 安装`pnpm i mobx mobx-react-lite`

- 配置`model->index.ts`

  ```js
  import { makeAutoObservable } from 'mobx'

  const store = makeAutoObservable({
    count: 1,
    setCount: (count: number) => {
      store.count = count
    }
  })

  export default store
  ```

- 使用方法举个 🌰

  ```tsx
  import store from '@/model'
  import { Button } from 'antd'
  import { observer, useLocalObservable } from 'mobx-react-lite'
  const Home: React.FC = () => {
    const localStore = useLocalObservable(() => store)
    return (
      <div>
        <Button>Antd</Button>
        <h1>{localStore.count}</h1>
      </div>
    )
  }

  export default observer(Home)
  ```

#### 配置 changelog（可不用）

`pnpm i conventional-changelog-cli -D`

第一次先执行`conventional-changelog -**p** angular -**i** CHANGELOG.md -s -r 0`全部生成之前的提交信息

配置个脚本，版本变化打 tag 的时候可以使用

```json
"scripts": {
	"changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
}
```

#### 配置 editorConfig 统一编辑器（可不用）

> editorConfig，可以同步编辑器差异，其实大部分工作 prettier 做了，需要下载 editorConfig vscode 插件
> 有编辑器差异的才配置一下，如果团队都是 vscode 就没必要了

- 配置`editorconfig`

  ```
  #不再向上查找.editorconfig
  root = true
  # *表示全部文件
  [*]
  #编码
  charset = utf-8
  #缩进方式
  indent_style = space
  #缩进空格数
  indent_size = 2
  #换行符lf
  end_of_line = lf
  ```

#### 配置 stylelint 检查 CSS 规范（可不用）

> stylelint 处理 css 更专业,但是用了 tailwind 之后用处不大了

- 安装：`pnpm i -D stylelint stylelint-config-standard`

- 配置`.stylelintrc.json`

  ```json
  {
    "extends": "stylelint-config-standard"
  }
  ```

- 配置`.vscode>settings.json`，配置后 vscode 保存时自动格式化 css

  ```json
  {
    "editor.codeActionsOnSave": {
      "source.fixAll.eslint": true, // 每次保存的时候将代码按照 eslint 格式进行修复
      "source.fixAll.stylelint": true //自动格式化stylelint
    },
    "editor.formatOnSave": true, //自动格式化
    "editor.defaultFormatter": "esbenp.prettier-vscode" //风格用prettier
  }
  ```

- 掌握`stylelint命令行`

  ```js
  npx stylelint "**/*.css" --fix//格式化所有css,自动修复css
  ```

#### 下面是 h5 项目（可不用）

#### 配置`vconsole`（h5）

- 安装`pnpm i vconsole -D`

- `main.tsx`里新增

  ```tsx
  import VConsole from 'vconsole'
  new VConsole({ theme: 'dark' })
  ```

#### antd 换成 mobile antd（h5）

- `pnpm remove antd`
- `pnpm add mobile-antd`

#### 配置 postcss-px-to-viewport（废弃）

- 把蓝湖设计稿尺寸固定为 1000px，然后你点出来的值比如是 77px，那你只需要写 7.7vw 就实现了自适应布局

- 安装：`pnpm i postcss-px-to-viewport -D`

- 配置`postcss.config.cjs`

  ```js
  module.exports = {
    plugins: {
      'postcss-px-to-viewport': {
        landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
        landscapeUnit: 'vw', // 横屏时使用的单位
        landscapeWidth: 568, // 横屏时使用的视口宽度
        unitToConvert: 'px', // 要转化的单位
        viewportWidth: 750, // UI设计稿的宽度
        unitPrecision: 5, // 转换后的精度，即小数点位数
        propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
        viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
        fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
        selectorBlackList: ['special'], // 指定不转换为视窗单位的类名，
        minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
        mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
        replace: true, // 是否转换后直接更换属性值
        exclude: [/node_modules/] // 设置忽略文件，用正则做目录名匹配
      }
    }
  }
  ```
