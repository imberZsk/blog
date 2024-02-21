'use client'

import React, { useState, useEffect } from 'react'

const VirtualList = () => {
  const [visibleItems, setVisibleItems] = useState([])
  const [scrollTop, setScrollTop] = useState(0)

  const totalItems = 10000 // 总数据项数量
  const itemHeight = 50 // 每个数据项的高度
  const visibleItemCount = Math.ceil(window.innerHeight / itemHeight) // 可见区域内的数据项数量
  const bufferSize = 5 // 缓冲区大小

  useEffect(() => {
    const handleScroll = () => {
      setScrollTop(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = startIndex + visibleItemCount + bufferSize

    // 生成可见的数据项
    const items = []
    for (let i = startIndex; i < endIndex; i++) {
      items.push(<div key={i} style={{ height: itemHeight }}>{`Item ${i}`}</div>)
    }
    // @ts-ignore
    setVisibleItems(items)
  }, [scrollTop, visibleItemCount])

  return (
    <div style={{ height: totalItems * itemHeight }}>
      <div style={{ position: 'sticky', top: 0 }}>
        {/* 占位元素，确保滚动后页面不会抖动 */}
        <div style={{ height: totalItems * itemHeight }}></div>
      </div>
      {visibleItems}
    </div>
  )
}

export default VirtualList
