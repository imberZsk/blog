// import { useRef, useState, useEffect } from 'react'
// import { data } from './constant'
// import Image from 'next/image'
// import debounce from 'lodash.debounce'

// export default function WaterFall() {
//   const [items, setItems] = useState<typeof data>([])
//   const [visibleItems, setVisibleItems] = useState<typeof data>([])
//   const containerRef = useRef<HTMLDivElement | null>(null)

//   const calculatePositions = () => {
//     const container = containerRef.current
//     if (!container) return

//     const columns = 3
//     const gap = 10
//     const columnHeights = new Array(columns).fill(0)
//     const itemsElements = Array.from(container.children) as HTMLElement[]

//     itemsElements.forEach((item, index) => {
//       const columnIndex = index % columns
//       const columnHeight = columnHeights[columnIndex]

//       const left = columnIndex * (item.offsetWidth + gap)
//       const top = columnHeight

//       item.style.position = 'absolute'
//       item.style.transform = `translate(${left}px, ${top}px)`

//       columnHeights[columnIndex] += item.offsetHeight + gap
//     })

//     const containerHeight = Math.max(...columnHeights)
//     container.style.height = `${containerHeight}px`
//   }

//   const fetchData = async () => {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         resolve(data)
//       }, 500)
//     })
//   }

//   useEffect(() => {
//     const init = async () => {
//       const res: any = await fetchData()
//       setItems(res)
//     }
//     init()
//   }, [])

//   const [isLoading, setIsLoading] = useState(false)

//   const handleScroll = () => {
//     if (isLoading) return

//     const windowHeight = window.innerHeight
//     const documentHeight = document.documentElement.scrollHeight
//     const scrollPosition = window.scrollY

//     const threshold = 50

//     if (documentHeight - (scrollPosition + windowHeight) < threshold) {
//       const fetchMoreData = async () => {
//         setIsLoading(true)
//         const res: any = await fetchData()
//         setItems(prevItems => [...prevItems, ...res])
//         setIsLoading(false)
//       }

//       fetchMoreData()
//     }
//   }

//   useEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     const debouncedHandleScroll = debounce(handleScroll, 200)
//     window.addEventListener('scroll', debouncedHandleScroll)

//     return () => {
//       window.removeEventListener('scroll', debouncedHandleScroll)
//     }
//   }, [])

//   useEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     const handleResize = debounce(() => {
//       calculatePositions()
//     }, 200)

//     window.addEventListener('resize', handleResize)

//     return () => {
//       window.removeEventListener('resize', handleResize)
//     }
//   }, [])

//   useEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     const handleScrollResize = debounce(() => {
//       calculatePositions()
//       handleScroll()
//     }, 200)

//     window.addEventListener('scroll', handleScrollResize)
//     window.addEventListener('resize', handleScrollResize)

//     return () => {
//       window.removeEventListener('scroll', handleScrollResize)
//       window.removeEventListener('resize', handleScrollResize)
//     }
//   }, [])

//   useEffect(() => {
//     const getVisibleItems = () => {
//       const container = containerRef.current
//       if (!container) return

//       const containerHeight = container.clientHeight
//       const scrollTop = window.scrollY
//       const visibleItems = items.filter(item => {
//         const itemTop = item.top - scrollTop
//         const itemBottom = itemTop + item.height
//         return itemTop < containerHeight && itemBottom > 0
//       })

//       setVisibleItems(visibleItems)
//     }

//     const calculateVisibleItems = debounce(getVisibleItems, 100)

//     window.addEventListener('scroll', calculateVisibleItems)
//     window.addEventListener('resize', calculateVisibleItems)

//     return () => {
//       window.removeEventListener('scroll', calculateVisibleItems)
//       window.removeEventListener('resize', calculateVisibleItems)
//     }
//   }, [items])

//   useEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     const itemsElements = Array.from(container.children) as HTMLElement[]

//     const itemDetails = itemsElements.map(item => ({
//       element: item,
//       top: item.offsetTop,
//       height: item.offsetHeight
//     }))

//     setItems(prevItems =>
//       prevItems.map((item, index) => ({
//         ...item,
//         top: itemDetails[index].top,
//         height: itemDetails[index].height
//       }))
//     )
//   }, [visibleItems])

//   return (
//     <div ref={containerRef} className="relative w-[770px]">
//       {visibleItems.map((item, index) => {
//         const { url_default, width, height } = item.note_card.cover
//         const { display_title } = item.note_card
//         return (
//           <div
//             key={index}
//             style={{
//               width: '250px',
//               marginBottom: '10px'
//             }}
//           >
//             <Image
//               src={url_default}
//               className="h-auto w-full object-cover"
//               width={width}
//               height={height}
//               alt=""
//               onLoad={calculatePositions}
//             />
//             <div>{display_title}</div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
