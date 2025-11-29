import { Icon } from '@iconify/react'
import { Button, EmptyStateScreen, useModalStore } from 'lifeforge-ui'

import type { Line } from '../../typescript/mrt.interfaces'
import LineItem from '../LineItem'
import ModifyLineModal from '../ModifyLineModal'

function LineSection({
  mrtLines,
  setMrtLines,
  selectedLineIndex,
  setSelectedLineIndex
}: {
  mrtLines: Line[]
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

  return (
    <>
      <div className="flex-between mb-4 gap-3 px-4">
        <div className="flex items-center gap-3">
          <Icon className="text-2xl" icon="tabler:route" />
          <h2 className="text-xl font-medium">Lines</h2>
        </div>
        <Button
          className="p-2!"
          icon="tabler:plus"
          variant="plain"
          onClick={() => {
            open(ModifyLineModal, {
              type: 'create',
              setLineData: setMrtLines
            })
          }}
        />
      </div>
      {mrtLines.length > 0 ? (
        <div className="space-y-3">
          {mrtLines.map((line, index) => (
            <LineItem
              key={`line-${index}`}
              index={index}
              line={line}
              selectedLineIndex={selectedLineIndex}
              setMrtLines={setMrtLines}
              setSelectedLineIndex={setSelectedLineIndex}
            />
          ))}
        </div>
      ) : (
        <EmptyStateScreen
          smaller
          icon="tabler:route-off"
          message={{
            title: 'No MRT Lines',
            description: 'Click the button above to add a new MRT line.'
          }}
        />
      )}
    </>
  )
}

export default LineSection
