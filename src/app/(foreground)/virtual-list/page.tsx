'use client'

import React, { useState, useEffect, useRef } from 'react'

const VirtualList = () => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(9)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const visibleItems = Math.ceil(clientHeight / 60) // 每个列表项高度为 60px
      const totalItems = 100 // 列表项总数

      const newStartIndex = Math.floor(scrollTop / 60)
      const newEndIndex = Math.min(newStartIndex + visibleItems - 1, totalItems - 1)

      setStartIndex(newStartIndex)
      setEndIndex(newEndIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className="mx-auto mt-[200px] h-[600px] w-[800px] overflow-hidden overflow-y-auto">
      <div style={{ height: `${startIndex * 60}px` }}></div>
      {Array(endIndex - startIndex + 1)
        .fill(0)
        .map((_, index) => {
          const itemIndex = startIndex + index
          return (
            <div key={itemIndex} className="mb-[20px] h-[60px] w-[800px] bg-[#ccc] text-center text-[30px] text-black">
              {itemIndex}
            </div>
          )
        })}
      <div style={{ height: `${(100 - endIndex - 1) * 60}px` }}></div>
    </div>
  )
}

export default VirtualList
