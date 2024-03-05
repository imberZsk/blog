'use client'

import React, { useState, useEffect, useRef } from 'react'

const VirtualList = () => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(7)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current

    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const clientHeight = container.clientHeight
      const visibleItems = Math.ceil(clientHeight / (60 + 20)) // 每个列表项高度为 60px
      console.log(visibleItems)
      const totalItems = 100 // 列表项总数

      const newStartIndex = Math.max(Math.floor(scrollTop / (60 + 20)) - 2, 0)
      const newEndIndex = Math.min(newStartIndex + visibleItems + 4, totalItems - 1)

      setStartIndex(newStartIndex)
      setEndIndex(newEndIndex)
    }

    container.addEventListener('scroll', handleScroll)
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={containerRef} className="mx-auto mt-[200px] h-[640px] w-[800px] overflow-hidden overflow-y-auto">
      <div style={{ height: `${startIndex * (60 + 20)}px` }}></div>
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
      <div style={{ height: `${(100 - endIndex - 1) * (60 + 20)}px` }}></div>
    </div>
  )
}

export default VirtualList
