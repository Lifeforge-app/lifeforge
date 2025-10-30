import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { useDrawing } from '../../../providers/DrawingProvider'

function SidebarDrawTypeSelector() {
  const { drawingMode, setDrawingMode } = useDrawing()

  const [showShapesTabs, setShowShapesTabs] = useState(false)

  useEffect(() => {
    if (drawingMode === 'outline' || drawingMode === 'outline-circle') {
      setShowShapesTabs(true)
    } else {
      setShowShapesTabs(false)
    }
  }, [drawingMode])

  return (
    <div className="mb-6">
      <div className="shadow-custom bg-bg-800 mb-2 mt-6 grid grid-cols-3 gap-2 rounded-xl p-2">
        <button
          className={clsx(
            'flex-center rounded-lg py-4 transition-all',
            drawingMode === 'units' ? 'bg-bg-700' : 'text-bg-500'
          )}
          onClick={() => {
            setDrawingMode('units')
          }}
        >
          <Icon className="mr-2 size-5" icon="tabler:building-store" />
          Units
        </button>
        <button
          className={clsx(
            'flex-center rounded-lg py-4 transition-all',
            ['outline', 'outline-circle'].includes(drawingMode)
              ? 'bg-bg-700'
              : 'text-bg-500'
          )}
          onClick={() => {
            setDrawingMode('outline')
          }}
        >
          <Icon className="mr-2 size-5" icon="tabler:shape" />
          Shapes
        </button>
        <button
          className={clsx(
            'flex-center rounded-lg py-4 transition-all',
            drawingMode.startsWith('amenities') ? 'bg-bg-700' : 'text-bg-500'
          )}
          onClick={() => {}}
        >
          <Icon className="mr-2 size-5" icon="tabler:star" />
          Amenities
        </button>
      </div>
      {showShapesTabs && (
        <div className="shadow-custom bg-bg-800 mb-6 grid grid-cols-2 gap-2 rounded-xl p-2">
          <button
            className={clsx(
              'flex-center rounded-lg py-4 transition-all',
              drawingMode === 'outline' ? 'bg-bg-700' : 'text-bg-500'
            )}
            onClick={() => {
              setDrawingMode('outline')
            }}
          >
            <Icon className="mr-2 size-5" icon="tabler:line" />
            Lines
          </button>
          <button
            className={clsx(
              'flex-center rounded-lg py-4 transition-all',
              drawingMode === 'outline-circle' ? 'bg-bg-700' : 'text-bg-500'
            )}
            onClick={() => {
              setDrawingMode('outline-circle')
            }}
          >
            <Icon className="mr-2 size-5" icon="tabler:circle" />
            Circles
          </button>
        </div>
      )}
    </div>
  )
}

export default SidebarDrawTypeSelector
