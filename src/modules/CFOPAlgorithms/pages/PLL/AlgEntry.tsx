import React, { useEffect, useRef } from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { algsetAlgs } from '../../algorithms/PLL'
import { type DEFAULT_CUBE } from '../../scripts/genCube'

const COLORS = {
  Y: 'bg-yellow-500',
  R: 'bg-red-500',
  O: 'bg-orange-500',
  G: 'bg-green-500',
  B: 'bg-blue-500',
  W: 'bg-white'
}

function AlgEntry({
  cube,
  index
}: {
  cube: typeof DEFAULT_CUBE
  index: number
}): React.ReactElement {
  const refs = useRef<Array<HTMLDivElement | null>>(Array(9).map(() => null))
  const containerRef = useRef<HTMLDivElement>(null)
  const { componentBg } = useThemeColors()

  useEffect(() => {
    if (!refs.current.every(Boolean) || containerRef.current === null) return

    const arrowSet = algsetAlgs[index].arrows

    for (const { s1, s2 } of arrowSet) {
      const start = refs.current[s1.n]
      const end = refs.current[s2.n]

      if (start === null || end === null) return

      const endRect = end.getBoundingClientRect()
      const startRect = start.getBoundingClientRect()

      const angle = Math.atan2(
        endRect.top - startRect.top,
        endRect.left - startRect.left
      )

      const length = Math.sqrt(
        (endRect.top - startRect.top) ** 2 +
          (endRect.left - startRect.left) ** 2
      )

      const arrowLine = document.createElement('div')
      arrowLine.className = 'absolute'
      arrowLine.style.width = `${length}px`
      arrowLine.style.height = '2px'
      arrowLine.style.backgroundColor = 'black'
      arrowLine.style.zIndex = '1'
      arrowLine.style.left = `${start.offsetLeft + 10}px`
      arrowLine.style.top = `${start.offsetTop + 10}px`
      arrowLine.style.transform = `rotate(${angle}rad)`
      arrowLine.style.transformOrigin = 'left'
      containerRef.current.appendChild(arrowLine)

      for (let i = 0; i < 2; i++) {
        const arrowHeadLeft = document.createElement('div')
        arrowHeadLeft.className = 'absolute'
        arrowHeadLeft.style.width = '6px'
        arrowHeadLeft.style.height = '2px'
        arrowHeadLeft.style.backgroundColor = 'black'
        arrowHeadLeft.style.borderRadius = '2px'
        arrowHeadLeft.style.zIndex = '1'
        arrowHeadLeft.style.left = `${end.offsetLeft + 10}px`
        arrowHeadLeft.style.top = `${end.offsetTop + 10}px`
        arrowHeadLeft.style.transform = `rotate(${
          angle + (i === 0 ? -1 : 1) * (3 / 4) * Math.PI
        }rad)`
        arrowHeadLeft.style.transformOrigin = 'left'
        containerRef.current.appendChild(arrowHeadLeft)
      }

      const smallRect = document.createElement('div')
      smallRect.className = 'absolute'
      smallRect.style.width = '2px'
      smallRect.style.height = '2px'
      smallRect.style.backgroundColor = 'black'
      smallRect.style.zIndex = '1'
      smallRect.style.left = `${end.offsetLeft + 9}px`
      smallRect.style.top = `${end.offsetTop + 10}px`
      smallRect.style.transform = `rotate(${angle + (3 / 4) * Math.PI}rad)`
      containerRef.current.appendChild(smallRect)
    }
  }, [])

  return (
    <li
      className={`flex w-full items-center justify-between gap-8 rounded-md p-4 shadow-custom ${componentBg}`}
    >
      <div className="flex items-center gap-8">
        <div className="rounded-md bg-bg-200/70 p-2 dark:bg-bg-800/50">
          <div ref={containerRef} className="relative flex flex-col gap-0.5">
            <div className="flex gap-0.5">
              <div className="size-5"></div>
              {cube.back[0].reverse().map((col, i) => (
                <div key={i} className="flex size-5 items-end gap-0.5">
                  <div
                    className={`h-1 w-5 rounded-full ${
                      COLORS[col as keyof typeof COLORS]
                    }`}
                  ></div>
                </div>
              ))}
              <div className="size-5"></div>
            </div>
            {cube.top.map((row, i) => (
              <div key={i} className="flex gap-0.5">
                <div className="flex size-5 justify-end">
                  <div
                    className={`h-5 w-1 rounded-full ${
                      COLORS[cube.left[0][i] as keyof typeof COLORS]
                    }`}
                  ></div>
                </div>
                {row.map((col, j) => (
                  <div
                    key={j}
                    ref={el => {
                      refs.current[i * 3 + j] = el
                    }}
                    className={`size-5 rounded-sm ${
                      col === 'Y' ? 'bg-yellow-500' : 'bg-bg-700'
                    }`}
                  ></div>
                ))}
                <div className="flex size-5 justify-start">
                  <div
                    className={`h-5 w-1 rounded-full ${
                      COLORS[cube.right[0][2 - i] as keyof typeof COLORS]
                    }`}
                  ></div>
                </div>
              </div>
            ))}
            <div className="flex gap-0.5">
              <div className="size-5"></div>
              {cube.front[0].map((col, i) => (
                <div key={i} className="flex size-5 items-start">
                  <div
                    className={`h-1 w-5 rounded-full ${
                      COLORS[col as keyof typeof COLORS]
                    }`}
                  ></div>
                </div>
              ))}
              <div className="size-5"></div>
            </div>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-bg-500">
            {algsetAlgs[index].name}
          </p>
          <p className="text-xl">{algsetAlgs[index].alg[0]}</p>
        </div>
      </div>
      <p className="mr-8 text-xl text-bg-500">{algsetAlgs[index].group}</p>
    </li>
  )
}

export default AlgEntry
