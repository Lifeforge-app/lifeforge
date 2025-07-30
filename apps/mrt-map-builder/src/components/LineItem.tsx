import {
  Button,
  ConfirmationModal,
  HamburgerMenu,
  MenuItem,
  NumberInput,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'

import ModifyLineModal from './ModifyLineModal'

function LineItem({
  line,
  index,
  currentPlotting,
  setMrtLines,
  selectedLineIndex,
  setSelectedLineIndex
}: {
  line: {
    name: string
    color: string
    path: [number, number][]
  }
  index: number
  currentPlotting: 'station' | 'line'
  setMrtLines: React.Dispatch<
    React.SetStateAction<
      {
        name: string
        color: string
        path: [number, number][]
      }[]
    >
  >
  selectedLineIndex: number | null
  setSelectedLineIndex: (index: number | null) => void
}) {
  const open = useModalStore(state => state.open)

  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className="border-bg-200 dark:border-bg-800 mx-4 rounded-lg border-2 p-4">
      <div className="flex-between gap-6">
        <div className="flex w-full min-w-0 items-center gap-2">
          <div
            className="h-6 w-1 rounded-full"
            style={{ backgroundColor: line.color }}
          />
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
          <HamburgerMenu
            classNames={{
              button: 'p-2!'
            }}
          >
            <MenuItem
              icon="tabler:edit"
              text="Edit Line"
              onClick={() => {
                open(ModifyLineModal, {
                  type: 'update',
                  setLineData: setMrtLines,
                  index,
                  initialData: { name: line.name, color: line.color }
                })
              }}
            />
            <MenuItem
              isRed
              icon="tabler:trash"
              text="Delete Line"
              onClick={() => {
                open(ConfirmationModal, {
                  title: 'Delete MRT Line',
                  description: 'Are you sure you want to delete this MRT line?',
                  onConfirm: async () => {
                    setMrtLines(prevLines =>
                      prevLines.filter((_, i) => i !== index)
                    )

                    if (selectedLineIndex === index) {
                      setSelectedLineIndex(null)
                    }
                  }
                })
              }}
            />
          </HamburgerMenu>
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
                  darker
                  className="w-full"
                  icon="tabler:square-letter-x"
                  name="X Coordinate"
                  namespace={false}
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
                  darker
                  className="w-full"
                  icon="tabler:square-letter-y"
                  name="Y Coordinate"
                  namespace={false}
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
      {currentPlotting === 'line' && (
        <Button
          className="mt-4 w-full"
          disabled={selectedLineIndex === index}
          icon="tabler:pointer"
          variant="secondary"
          onClick={() => {
            setSelectedLineIndex(index)
          }}
        >
          {selectedLineIndex === index ? 'Currently Selected' : 'Select Line'}
        </Button>
      )}
    </div>
  )
}

export default LineItem
