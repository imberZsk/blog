> - 支持 eslint 和 prettier
> - 使用 simple-git-hooks、lint-staged、conventional-changelog-cli
> - 支持 ts、支持 es module
> - 支持 monorepo

## 1、package.json

`npm init -y`然后借鉴源码的 package.json 替换一下生成的，然后`pnpm i`下好这些包

```js
{
  "private": true,
  "version": "3.0.0",
  "packageManager": "pnpm@8.6.2",
  "type": "module",
  "scripts": {
    "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s",
    "postinstall": "simple-git-hooks",
    "fix:prettier": "prettier --write .",
    "dev": "node ./scripts/dev.js"
  },
  "devDependencies": {
    "@commitlint/cli": "^17.6.6",
    "@commitlint/config-conventional": "^17.6.6",
    "@types/node": "^20.3.2",
    "@typescript-eslint/parser": "^5.60.0",
    "conventional-changelog-cli": "^3.0.0",
    "esbuild": "^0.18.10",
    "eslint": "^8.43.0",
    "lint-staged": "^13.2.2",
    "minimist": "^1.2.8",
    "prettier": "^2.8.8",
    "simple-git-hooks": "^2.8.1"
  },
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged",
    "commit-msg": "node scripts/verifyCommit.js"
  },
  "lint-staged": {
    "*.{js,json}": [
      "prettier --write"
    ],
    "*.ts?(x)": [
      "eslint",
      "prettier --parser=typescript --write"
    ]
  },
  "engines": {
    "node": ">=16.11.0"
  },
  "dependencies": {
    "chalk": "^5.3.0"
  }
}
```

## 2、.gitignore

`git init`之后配置

```js
dist
.DS_Store
node_modules
coverage
temp
explorations
TODOs.md
*.log
.idea
.eslintcache
dts-build/packages
*.tsbuildinfo
```

## 3、配置.prettier.json

```js
{
  "semi": false,//末尾不要分号
  "singleQuote": true,//要单引号
  "printWidth": 80,//一行最长宽度80超过换行
  "trailingComma": false,//不要尾随逗号
  "arrowParens": "avoid"//箭头函数如果一个参数省略括号
}
```

`.prettierignore`

```js
dist
```

## 3、配置.vscode>settings.json

```js
{
  // Use the project's typescript version
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true // 每次保存的时候将代码按照 eslint 格式进行修复,但是这个项目里就自己写了几个规则，所以基本没用
  },
  "editor.formatOnSave": true, //自动格式化
  // Use prettier to format typescript, javascript and JSON files
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## 4、配置.eslintrc.cjs

```js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-debugger': 'error',
        'no-unused-vars': [
      'error',
      // we are only using this rule to check for unused arguments since TS
      // catches unused variables but not args.
      { varsIgnorePattern: '.*', args: 'none' }
    ],
    'no-restricted-syntax': [
      'error',
      'ObjectPattern > RestElement',
      'ObjectExpression > SpreadElement',
      'AwaitExpression'
    ]
  }
}
```

## 5、配置tsconfig.json

```js
{
  "compilerOptions": {
    "outDir": "temp",
    "sourceMap": false,
    "target": "es2016",
    "newLine": "LF",
    "useDefineForClassFields": false,
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": false,
    "strict": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "removeComments": false,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "jsx": "preserve",
    "lib": ["esnext", "dom"],
    "rootDir": ".",
    "baseUrl": ".",
    "paths": {
      "@vue/*": ["packages/*/src"],
      "vue": ["packages/vue/src"]
    }
  }
}
```

## 6、将share安装到reactivity

```js
pnpm i @vue/shared@workspace --filter @vue/reactivity
```

## 7、配置打包dev.js

简化一点一些配置直接写死

```js
import esbuild from 'esbuild'
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import minimist from 'minimist'

//import.meta.url: file:///Users/imber/Desktop/vue3-base/scripts/dev.js
// fileURLToPath(import.meta.url): /Users/imber/Desktop/vue3-base/scripts/dev.js
// __dirname: /Users/imber/Desktop/vue3-base/scripts

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))
const args = minimist(process.argv.slice(2))

const target = args._[0] || 'vue' //第一个参数 打包的模块
const format = args.f || 'esm' // -f 打包出来的格式
const pkg = require(`../packages/${target}/package.json`) //获取package里面的对象
const postfix = format

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${postfix}.js`
)
const relativeOutfile = relative(process.cwd(), outfile)

const plugins = [
  {
    name: 'log-rebuild',
    setup(build) {
      build.onEnd(() => {
        console.log(
          `打包${target}模块，路径是${resolve(
            __dirname,
            `../packages/${target}/src/index.ts`
          )}生成${relativeOutfile}`
        )
      })
    }
  }
]

esbuild
  .context({
    entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
    outfile,
    bundle: true,
    sourcemap: true,
    format: 'esm',
    globalName: pkg.buildOptions?.name,
    platform: 'browser',
    plugins
  })
  .then(ctx => ctx.watch())
```

