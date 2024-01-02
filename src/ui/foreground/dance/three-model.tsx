'use client'

import { useLoadModal } from './hooks'

const ThreeModel = () => {
  const { containerRef } = useLoadModal()
  return <div className="h-full w-full" ref={containerRef} />
}

export default ThreeModel
