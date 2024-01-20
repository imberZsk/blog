'use client'

import { useRef, useState, useEffect } from 'react'
import { data } from './constant'
import Image from 'next/image'

export default function WaterFall() {
  const [items, setItems] = useState<typeof data>([])
  const containerRef = useRef<HTMLDivElement | null>(null)

  // 模拟从服务器获取数据
  useEffect(() => {
    // 模拟异步加载数据
    const fetchData = async () => {
      setTimeout(() => {
        setItems(data)
      }, 1000)
    }

    fetchData()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 动态计算每个元素的位置
    const calculatePositions = () => {
      console.log(1)
      const columns = 3 // 列数
      const columnHeights = new Array(columns).fill(0) // 每列的高度

      const itemsElements = Array.from(container.children) as HTMLElement[]
      itemsElements.forEach((item, index) => {
        const columnIndex = index % columns
        const columnHeight = columnHeights[columnIndex]

        // 计算每个元素的位置
        const left = columnIndex * (item.offsetWidth + 10) // 10 是列之间的间距
        const top = columnHeight

        item.style.position = 'absolute'
        item.style.transform = `translate(${left}px, ${top}px)`

        // 更新列高度
        columnHeights[columnIndex] += item.offsetHeight + 10 // 10 是行之间的间距
      })

      // 设置容器高度，以便滚动加载更多数据
      const containerHeight = Math.max(...columnHeights)
      container.style.height = `${containerHeight}px`
    }

    calculatePositions() // 初始化时执行一次计算

    // 在窗口大小变化时重新计算位置
    const handleResize = () => {
      calculatePositions()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleScroll = () => {
    // 判断是否滚动到底部，然后加载更多数据
    const container = containerRef.current
    if (!container) return
    const scrollPosition = container.scrollHeight - container.scrollTop - container.clientHeight
    const threshold = 50 // 距离底部的阈值

    if (scrollPosition < threshold) {
      // 模拟异步加载更多数据
      const fetchMoreData = async () => {
        // 模拟从服务器获取更多数据
        const response = await fetch('https://api.example.com/more-data')
        const data = await response.json()
        setItems(prevItems => [...prevItems, ...data])
      }

      fetchMoreData()
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef}>
      {items.map((item, index) => {
        const { url_default, width, height } = item.note_card.cover
        const { display_title } = item.note_card
        return (
          <div key={index}>
            <div
              style={{
                width: '250px',
                marginBottom: '10px' // 行之间的间距
              }}
            >
              <Image src={url_default} className="h-auto w-full object-cover" width={width} height={height} alt="" />
              <div>{display_title}</div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
