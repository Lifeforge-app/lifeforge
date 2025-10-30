import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { useEffect, useState } from 'react'

import { useDrawing } from '../../../providers/DrawingProvider'

function SidebarDrawTypeSelector({
  unitTab,
  setUnitTab
}: {
  unitTab: 'polygons' | 'data'
  setUnitTab: (tab: 'polygons' | 'data') => void
}) {
  const { drawingMode, setDrawingMode, selectedElementId } = useDrawing()

  const [showShapesTabs, setShowShapesTabs] = useState(false)

  const [showUnitTabs, setShowUnitTabs] = useState(false)

  useEffect(() => {
    if (drawingMode === 'outline' || drawingMode === 'outline-circle') {
      setShowShapesTabs(true)
    } else {
      setShowShapesTabs(false)
    }
  }, [drawingMode])

  useEffect(() => {
    if (drawingMode === 'units') {
      setShowUnitTabs(true)
      setUnitTab('polygons')
    } else {
      setShowUnitTabs(false)
    }
  }, [drawingMode, selectedElementId])

  return (
    <div>
      <div className="shadow-custom bg-bg-800 mb-2 mt-4 grid grid-cols-3 gap-2 rounded-lg p-2">
        <button
          className={clsx(
            'flex-center rounded-lg py-4 transition-all',
            drawingMode === 'units' ? 'bg-bg-700' : 'text-bg-500'
          )}
          onClick={() => {
            setDrawingMode('units')
            setShowUnitTabs(true)
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
            drawingMode === 'amenity' ? 'bg-bg-700' : 'text-bg-500'
          )}
          onClick={() => {
            setDrawingMode('amenity')
          }}
        >
          <Icon className="mr-2 size-5" icon="tabler:star" />
          Amenities
        </button>
      </div>
      {showUnitTabs && !selectedElementId && (
        <div className="shadow-custom bg-bg-800 mb-6 grid grid-cols-2 gap-2 rounded-lg p-2">
          <button
            className={clsx(
              'flex-center rounded-lg py-4 transition-all',
              unitTab === 'polygons' ? 'bg-bg-700' : 'text-bg-500'
            )}
            onClick={() => {
              setUnitTab('polygons')
            }}
          >
            <Icon className="mr-2 size-5" icon="tabler:polygon" />
            Polygons
          </button>
          <button
            className={clsx(
              'flex-center rounded-lg py-4 transition-all',
              unitTab === 'data' ? 'bg-bg-700' : 'text-bg-500'
            )}
            onClick={() => {
              setUnitTab('data')
            }}
          >
            <Icon className="mr-2 size-5" icon="tabler:info-circle" />
            Data
          </button>
        </div>
      )}
      {showShapesTabs && !selectedElementId && (
        <div className="shadow-custom bg-bg-800 mb-6 grid grid-cols-2 gap-2 rounded-lg p-2">
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
