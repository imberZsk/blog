'use client'

import { useRef, useState, useEffect } from 'react'
import { data } from './constant'
import Image from 'next/image'
import debounce from 'lodash.debounce'

export default function WaterFall() {
  // 数据
  const [items, setItems] = useState<typeof data>([])
  // 容器
  const containerRef = useRef<HTMLDivElement | null>(null)
  // 距离底部的阈值
  const threshold = 50
  // 列数
  const columns = 3
  // 间距
  const gap = 10

  // 计算布局函数
  const calculatePositions = () => {
    // 获取容器
    const container = containerRef.current
    if (!container) return
    // 每列的高度数组
    const columnHeights = new Array(columns).fill(0)
    // 获取要排列的元素数组
    const itemsElements = Array.from(container.children) as HTMLElement[]
    // 遍历元素数组
    itemsElements.forEach((item, index) => {
      //取余获取item在哪一列
      const columnIndex = index % columns
      //从高度数组中获取当前列的高度
      const columnHeight = columnHeights[columnIndex]
      // 计算每个元素的位置
      const left = columnIndex * (item.offsetWidth + gap)
      const top = columnHeight
      // 移动
      item.style.position = 'absolute'
      item.style.transform = `translate(${left}px, ${top}px)`
      // 更新列高度
      columnHeights[columnIndex] += item.offsetHeight + gap
    })
    // 遍历完后获取最大高度
    const containerHeight = Math.max(...columnHeights)
    // 设置容器高度，以便滚动加载更多数据
    container.style.height = `${containerHeight}px`
  }

  //模拟获取数据
  const fetchData = async () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(data)
      })
    })
  }

  // 初始化
  useEffect(() => {
    const init = async () => {
      const res: any = await fetchData()
      setItems(res)
      // window.onload = calculatePositions()
    }
    init()

    const container = containerRef.current
    if (!container) return

    const handleResize = () => {
      calculatePositions()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 加载更多事件
  const handleScroll = () => {
    // 判断是否滚动到底部，然后加载更多数据
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollPosition = window.scrollY

    if (documentHeight - (scrollPosition + windowHeight) < threshold) {
      // 模拟异步加载更多数据
      const fetchMoreData = async () => {
        // 模拟从服务器获取更多数据
        const res: any = await fetchData()
        setItems(prevItems => [...prevItems, ...res])
      }

      fetchMoreData()
    }
  }

  // 监听滚动事件
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const debouncedHandleScroll = debounce(handleScroll, 400)
    window.addEventListener('scroll', debouncedHandleScroll)
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll)
    }
  }, [])

  // 虚拟列表
  useEffect(() => {
    const getVisibleItems = () => {
      const container = containerRef.current
      if (!container) return
    }

    const calculateVisibleItems = debounce(getVisibleItems, 100)

    calculateVisibleItems()

    window.addEventListener('scroll', calculateVisibleItems)
    window.addEventListener('resize', calculateVisibleItems)

    return () => {
      window.removeEventListener('scroll', calculateVisibleItems)
      window.removeEventListener('resize', calculateVisibleItems)
    }
  }, [items])

  return (
    <div ref={containerRef} className="relative w-[770px] overflow-scroll">
      {items.map((item, index) => {
        const { url_default, width, height } = item.note_card.cover
        const { display_title } = item.note_card
        return (
          <div
            key={index}
            style={{
              width: '250px',
              marginBottom: '10px' // 行之间的间距
            }}
          >
            <Image
              src={url_default}
              className="h-auto w-full object-cover"
              width={width}
              height={height}
              alt=""
              onLoad={calculatePositions}
            />
            <div>{display_title}</div>
          </div>
        )
      })}
    </div>
  )
}
