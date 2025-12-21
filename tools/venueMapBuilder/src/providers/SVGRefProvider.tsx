import { createContext, useContext, useRef } from 'react'

const SVGRefContext = createContext<{
  svgRef: React.RefObject<SVGSVGElement | null>
  gRef: React.RefObject<SVGGElement | null>
} | null>(null)

function SVGRefProvider({ children }: { children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement | null>(null)

  const gRef = useRef<SVGGElement | null>(null)

  return <SVGRefContext value={{ svgRef, gRef }}>{children}</SVGRefContext>
}

export function useSVGRefContext() {
  const context = useContext(SVGRefContext)

  if (!context) {
    throw new Error('useSVGContext must be used within a SVGProvider')
  }

  return context
}

export default SVGRefProvider
