'use client'

import { useLoadModal } from './hooks'

const ThreeModel = () => {
  const { containerRef } = useLoadModal()
  return <div className="w-full h-full" ref={containerRef} />
}

export default ThreeModel
