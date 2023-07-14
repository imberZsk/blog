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
