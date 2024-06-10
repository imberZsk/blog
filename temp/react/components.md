> 基于 Tailwind 的组件

## 加载中

```js
<div className="flex items-center justify-center h-screen absolute left-0 top-0 w-full">
  <div className="animate-spin rounded-full h-8 w-8 border-4 border-b-transparent border-[#ff4132] "></div>
</div>
```

## 切换按钮

```js
<div
  className={`w-[10vw] h-[5.6vw] relative rounded-[11px] transition-colors duration-500 ${
    field.value ? 'bg-[#ff4132]' : 'bg-[rgba(0,0,0,0.08)]'
  }`}
  onClick={toggleIsDefault}
>
  <div
    className={`rounded-[50%] h-[3.9vw] ease-[cubic-bezier(0.68,-0.55,0.27,1.55)] w-[3.9vw] bg-[#fff] absolute top-[50%] translate-y-[-50%] transition-all duration-500 ${
      field.value ? 'right-[0.8vw]' : 'right-[5.3vw]'
    }`}
  ></div>
</div>
```

## 弹窗

## 点击页面其它地方关闭

```jsx
import { useRef } from 'react'
const selectOpenRef = (useRef < HTMLDivElement) | (null > null)
useEffect(() => {
  function handleClickOutside(event: any) {
    if (
      selectOpenRef.current &&
      !selectOpenRef.current.contains(event.target)
    ) {
      setIsShowOption(false)
    }
  }

  document.addEventListener('click', handleClickOutside)

  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
}, [])
```

## loading

```js
const [loading, serLoading] = useState(false)

{
  loading && (
    <div
      className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-[rgba(0,0,0,0.1)]"
      style={{ backdropFilter: 'blur(5px)' }}
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="loader-ui"></div>
    </div>
  )
}
```

```css
.loader_ui {
  display: block;
  width: 130px;
  height: 4px;
  border-radius: 30px;
  background-color: rgba(0, 0, 0, 0.2);
  position: relative;
}

.loader_ui::before {
  content: '';
  position: absolute;
  background: #ff4132;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  border-radius: 30px;
  animation: moving 1s ease-in-out infinite;
}

@keyframes moving {
  50% {
    width: 100%;
  }

  100% {
    width: 0;
    right: 0;
    left: unset;
  }
}
```
