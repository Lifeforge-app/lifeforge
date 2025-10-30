import { Icon } from '@iconify/react'
import {
  Button,
  ConfirmationModal,
  FileInput,
  ModalHeader,
  SliderInput,
  Switch,
  TextInput,
  useModalStore
} from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { useFloors } from '../../providers/FloorsProvider'
import { useSettings } from '../../providers/SettingsProvider'

function SettingsModal({ onClose }: { onClose: () => void }) {
  const open = useModalStore(state => state.open)

  const settings = useSettings()

  const {
    floors,
    selectedFloorId,
    selectedFloor: { floorPlanImage }
  } = useFloors()

  const [fileData, setFileData] = useState<{
    file: File | string | null
    preview: string | null
  }>({
    file: null,
    preview: floorPlanImage
  })

  useEffect(() => {
    setFileData(() => ({
      file: floorPlanImage,
      preview: floorPlanImage
    }))
  }, [floorPlanImage])

  return (
    <div className="min-w-[40vw]">
      <ModalHeader icon="tabler:settings" title="Settings" onClose={onClose} />
      <TextInput
        className="mt-4"
        icon="tabler:number-123"
        label="Floor Abbreviation"
        placeholder="e.g., G, L1, B"
        setValue={settings.handleFloorIdChange}
        value={selectedFloorId}
      />
      <TextInput
        className="mt-4"
        icon="uil:layers"
        label="Floor Name"
        placeholder="e.g., Ground Floor"
        setValue={settings.handleFloorNameChange}
        value={floors.find(floor => floor.id === selectedFloorId)?.name || ''}
      />
      <div className="mt-6 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:photo" />
          <span className="text-lg">Show floor plan image</span>
        </div>
        <Switch
          checked={settings.showFloorPlanImage}
          onChange={settings.handleToggleShowFloorPlanImage}
        />
      </div>
      <div className="mb-6 mt-4">
        <FileInput
          acceptedMimeTypes={{
            image: ['png', 'jpeg', 'jpg', 'webp', 'svg']
          }}
          file={fileData.file}
          icon="tabler:photo"
          label="FloorPlan Image"
          preview={fileData.preview}
          reminderText="Upload a floorPlan image to trace"
          setData={data => {
            setFileData(data)
            settings.handleFloorPlanImageChange(data.file)
          }}
          onImageRemoved={() => {
            settings.handleFloorPlanImageChange(null)
          }}
        />
      </div>
      <SliderInput
        icon="tabler:text-size"
        label="Unit Name Font Size"
        max={16}
        min={1}
        setValue={settings.handleUnitLabelFontSizeChange}
        step={1}
        value={settings.unitLabelFontSize}
      />
      <SliderInput
        icon="tabler:circle-dashed"
        label="Point Radius"
        max={16}
        min={1}
        setValue={settings.handlePointRadiusChange}
        step={1}
        value={settings.pointRadius}
        wrapperClassName="mt-10"
      />
      <div className="mt-12 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:building-store" />
          <span className="text-lg">Show unit</span>
        </div>
        <Switch
          checked={settings.showUnit}
          onChange={settings.handleToggleShowUnit}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:line" />
          <span className="text-lg">Show outline</span>
        </div>
        <Switch
          checked={settings.showUnitOutline}
          onChange={settings.handleToggleShowOutline}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:route" />
          <span className="text-lg">Show paths</span>
        </div>
        <Switch
          checked={settings.showPaths}
          onChange={settings.handleToggleShowPaths}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:map-pin" />
          <span className="text-lg">Show amenities</span>
        </div>
        <Switch
          checked={settings.showAmenities}
          onChange={settings.handleToggleShowAmenities}
        />
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div className="text-bg-500 flex items-center gap-2">
          <Icon className="size-6" icon="tabler:door-enter" />
          <span className="text-lg">Show entrances</span>
        </div>
        <Switch
          checked={settings.showEntrances}
          onChange={settings.handleToggleShowEntrances}
        />
      </div>

      <div className="mb-2 mt-12 flex items-center gap-2">
        <Button
          className="w-full"
          icon="uil:import"
          variant="secondary"
          onClick={settings.handleImport}
        >
          Import
        </Button>
        <Button
          className="w-full"
          icon="uil:export"
          variant="primary"
          onClick={settings.handleExport}
        >
          Export
        </Button>
      </div>
      <Button
        dangerous
        className="w-full"
        icon="uil:trash"
        variant="secondary"
        onClick={() => {
          open(ConfirmationModal, {
            title: 'Clear All Data',
            description:
              'Are you sure you want to clear all mall data? This action cannot be undone.',
            confirmationButton: 'delete',
            confirmationPrompt: settings.mallName,
            onConfirm: async () => {
              settings.handleClearAllData()
            }
          })
        }}
      >
        Clear All Data
      </Button>
    </div>
  )
}

export default SettingsModal
