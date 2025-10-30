import { Icon } from '@iconify/react'
import clsx from 'clsx'
import {
  Button,
  ListboxInput,
  ListboxOption,
  useModalStore
} from 'lifeforge-ui'
import { useState } from 'react'

import { useFloors } from '../../../providers/FloorsProvider'
import { useSettings } from '../../../providers/SettingsProvider'
import AddFloorModal from '../../modals/AddFloorModal'
import EditMallNameModal from '../../modals/EditMallNameModal'
import SidebarSettings from './SidebarSettings'

function SidebarHeader() {
  const { open } = useModalStore(state => state)

  const { mallName, setMallName, handleCreateFloor } = useSettings()

  const { floors, selectedFloorId, setSelectedFloorId } = useFloors()

  const [settingsExpanded, setSettingsExpanded] = useState(false)

  return (
    <>
      <div className="flex-between mb-6">
        <div className="flex items-center gap-2">
          <Icon className="size-6" icon="tabler:building-skyscraper" />
          <span className="text-xl font-medium">{mallName}</span>
        </div>
        <Button
          icon="tabler:pencil"
          variant="plain"
          onClick={() => {
            open(EditMallNameModal, {
              currentName: mallName,
              onSave: setMallName
            })
          }}
        />
      </div>
      <ListboxInput
        buttonContent={
          <span>
            {(() => {
              const floor = floors.find(f => f.id === selectedFloorId)

              if (!floor) {
                return 'Select Floor'
              }

              return `${floor.name} (${floor.id})`
            })()}
          </span>
        }
        className="mb-6"
        icon="uil:layer-group"
        label="Floor Number"
        setValue={floor => {
          const newFloorId = floor as string

          if (newFloorId === 'new-floor') {
            open(AddFloorModal, {
              onCreateFloor: handleCreateFloor
            })

            return
          }

          setSelectedFloorId(newFloorId)
        }}
        value={selectedFloorId}
      >
        {floors.map(floor => (
          <ListboxOption
            key={floor.id}
            label={`${floor.name} (${floor.id})`}
            value={floor.id}
          />
        ))}
        <ListboxOption key="new-floor" label="New Floor" value="new-floor" />
      </ListboxInput>
      <div
        className="flex-between hover:text-bg-100 text-bg-500 mb-2 w-full cursor-pointer rounded-lg p-2 transition-all"
        onClick={() => {
          setSettingsExpanded(!settingsExpanded)
        }}
      >
        <div className="flex items-center gap-2 text-lg font-medium">
          <Icon className="size-6" icon="tabler:settings" />
          Settings
        </div>
        <Icon
          className={clsx('size-5 transition-all', {
            'rotate-90': settingsExpanded
          })}
          icon="tabler:chevron-right"
        />
      </div>
      {settingsExpanded && <SidebarSettings />}
    </>
  )
}

export default SidebarHeader
