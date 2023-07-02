## 1、初始化项目

npx create-next-app@latest

![img](https://cdn.nlark.com/yuque/0/2023/png/22629207/1688112191278-9d8aa72d-d65e-4e57-a8b3-86305c3231d8.png)

用最新的app + page目录模式

默认使用npm、直接删了package-lock.json然后 `sudo pnpm i`

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

## 5、eslintrc.json增加规则

```js

```



