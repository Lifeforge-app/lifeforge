import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { ListboxInput, ListboxOption } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useDrawing } from '../../../providers/DrawingProvider'
import type { DrawingMode } from '../../../types'

const DRAWING_MODES: {
  value: DrawingMode
  label: string
  icon: string
}[] = [
  { value: 'units', label: 'Units', icon: 'tabler:building-store' },
  { value: 'outline', label: 'Lines', icon: 'tabler:line' },
  { value: 'outline-circle', label: 'Circles', icon: 'tabler:circle' },
  { value: 'amenity', label: 'Amenities', icon: 'tabler:star' },
  { value: 'path', label: 'Paths', icon: 'tabler:route' }
]

function SidebarDrawTypeSelector({
  unitTab,
  setUnitTab
}: {
  unitTab: 'polygons' | 'data'
  setUnitTab: (tab: 'polygons' | 'data') => void
}) {
  const { drawingMode, setDrawingMode, selectedElementId } = useDrawing()

  const [showUnitTabs, setShowUnitTabs] = useState(false)

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
      <ListboxInput
        buttonContent={
          <>
            <Icon
              className="size-5"
              icon={
                DRAWING_MODES.find(m => m.value === drawingMode)?.icon || ''
              }
            />
            {DRAWING_MODES.find(m => m.value === drawingMode)?.label ||
              'Select mode'}
          </>
        }
        className="my-4"
        icon="tabler:category"
        label="Drawing Mode"
        onChange={(value: unknown) => {
          const mode = value as DrawingMode

          setDrawingMode(mode)

          if (mode === 'units') {
            setShowUnitTabs(true)
          }
        }}
        value={drawingMode}
      >
        {DRAWING_MODES.map(mode => (
          <ListboxOption
            key={mode.value}
            icon={mode.icon}
            label={mode.label}
            value={mode.value}
          />
        ))}
      </ListboxInput>
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
    </div>
  )
}

export default SidebarDrawTypeSelector
