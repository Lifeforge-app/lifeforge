import clsx from 'clsx'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  NumberInput,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'
import tinycolor from 'tinycolor2'

import type { Line } from '../typescript/mrt.interfaces'
import ModifyLineModal from './ModifyLineModal'

function LineItem({
  line,
  index,
  setMrtLines,
  selectedLineIndex,
  setSelectedLineIndex
}: {
  line: Line
  index: number
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  selectedLineIndex: {
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }
  setSelectedLineIndex: (
    type: 'path_drawing' | 'station_plotting',
    index: number | null
  ) => void
}) {
  const open = useModalStore(state => state.open)

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="border-bg-200 dark:border-bg-800 mx-4 rounded-lg border-2 p-4">
      <div className="flex-between gap-6">
        <div className="flex w-full min-w-0 items-center gap-2">
          {line.code ? (
            <div
              className={clsx(
                'min-h-6 rounded-sm px-2 pb-0.5 font-[LTAIdentityMedium]',
                tinycolor(line.color).isDark() ? 'text-bg-100' : 'text-bg-800'
              )}
              style={{ backgroundColor: line.color }}
            >
              {line.code}
            </div>
          ) : (
            <div
              className="h-6 w-1 rounded-sm font-[LTAIdentityMedium]"
              style={{ backgroundColor: line.color }}
            />
          )}
          <div className="w-full min-w-0 truncate text-lg font-medium">
            {line.name}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className={`p-2! ${collapsed ? 'rotate-180' : ''} transition-transform`}
            icon="tabler:chevron-down"
            variant="plain"
            onClick={() => {
              setCollapsed(!collapsed)
            }}
          />
          <ContextMenu
            classNames={{
              button: 'p-2!'
            }}
          >
            <ContextMenuItem
              icon="tabler:edit"
              label="Edit Line"
              onClick={() => {
                open(ModifyLineModal, {
                  type: 'update',
                  setLineData: setMrtLines,
                  index,
                  initialData: {
                    name: line.name,
                    color: line.color,
                    code: line.code
                  }
                })
              }}
            />
            <ContextMenuItem
              dangerous
              icon="tabler:trash"
              label="Delete Line"
              onClick={() => {
                open(ConfirmationModal, {
                  title: 'Delete MRT Line',
                  description: 'Are you sure you want to delete this MRT line?',
                  onConfirm: async () => {
                    setMrtLines(prevLines =>
                      prevLines.filter((_, i) => i !== index)
                    )

                    if (selectedLineIndex.index === index) {
                      setSelectedLineIndex('path_drawing', null)
                    }
                  }
                })
              }}
            />
          </ContextMenu>
        </div>
      </div>
      {!collapsed && (
        <ul className="mt-4 flex flex-col gap-2">
          {line.path.length > 0 ? (
            line.path.map((point, pointIndex) => (
              <li
                key={pointIndex}
                className="border-bg-200 dark:border-bg-800 space-y-2 rounded-md border-2 p-4"
              >
                <NumberInput
                  className="w-full"
                  icon="tabler:square-letter-x"
                  name="X Coordinate"
                  placeholder="X Coordinate"
                  setValue={value => {
                    setMrtLines(prevLines =>
                      prevLines.map((l, i) => {
                        if (i !== index) return l

                        const newPath = [...l.path]

                        newPath[pointIndex][0] = value

                        return { ...l, path: newPath }
                      })
                    )
                  }}
                  value={point[0]}
                />
                <NumberInput
                  className="w-full"
                  icon="tabler:square-letter-y"
                  name="Y Coordinate"
                  placeholder="Y Coordinate"
                  setValue={value => {
                    setMrtLines(prevLines =>
                      prevLines.map((l, i) => {
                        if (i !== index) return l

                        const newPath = [...l.path]

                        newPath[pointIndex][1] = value

                        return { ...l, path: newPath }
                      })
                    )
                  }}
                  value={point[1]}
                />
              </li>
            ))
          ) : (
            <p className="text-bg-500">
              No points added yet. Click on the map to add points.
            </p>
          )}
        </ul>
      )}
      <Button
        className="mt-4 w-full"
        disabled={
          selectedLineIndex.index === index &&
          selectedLineIndex.type === 'path_drawing'
        }
        icon="tabler:brush"
        variant="secondary"
        onClick={() => {
          setSelectedLineIndex('path_drawing', index)
        }}
      >
        {selectedLineIndex.index === index &&
        selectedLineIndex.type === 'path_drawing'
          ? 'Currently Drawing'
          : 'Draw Path'}
      </Button>
      <Button
        className="mt-2 w-full"
        disabled={
          selectedLineIndex.index === index &&
          selectedLineIndex.type === 'station_plotting'
        }
        icon="tabler:target-arrow"
        variant="secondary"
        onClick={() => {
          setSelectedLineIndex('station_plotting', index)
        }}
      >
        {selectedLineIndex.index === index &&
        selectedLineIndex.type === 'station_plotting'
          ? 'Currently Plotting Stations'
          : 'Plot Stations'}
      </Button>
    </div>
  )
}

export default LineItem
