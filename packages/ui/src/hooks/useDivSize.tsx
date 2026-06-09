import React, { useEffect, useState } from 'react'

function useDivSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0)

  const [height, setHeight] = useState(0)

  function handleResize() {
    if (ref.current) {
      setWidth(ref.current.offsetWidth)
      setHeight(ref.current.offsetHeight)
    }
  }

  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new ResizeObserver(handleResize)

    observer.observe(element)
    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [ref])

  return { width, height }
}

export default useDivSize
