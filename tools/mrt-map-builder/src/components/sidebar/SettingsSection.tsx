import { Icon } from '@iconify/react'
import {
  Button,
  ColorInput,
  ConfirmationModal,
  FileInput,
  SliderInput,
  Switch,
  useModalStore
} from 'lifeforge-ui'

import type { Line, Settings, Station } from '../../typescript/mrt.interfaces'

function SettingsSection({
  setMrtLines,
  setMrtStations,
  settings,
  setSettings,
  setSelectedLineIndex,
  importData,
  exportData
}: {
  setMrtLines: React.Dispatch<React.SetStateAction<Line[]>>
  setMrtStations: React.Dispatch<React.SetStateAction<Station[]>>
  settings: Settings
  setSettings: (settings: Partial<Settings>) => void
  setSelectedLineIndex: (
    type: 'path_drawing' | 'station_plotting',
    index: number | null
  ) => void
  importData: () => void
  exportData: () => void
}) {
  const open = useModalStore(state => state.open)

  return (
    <>
      <div className="mb-4 flex items-center gap-3 px-4">
        <Icon className="text-2xl" icon="tabler:settings" />
        <h2 className="text-xl font-medium">Settings</h2>
      </div>
      <div className="space-y-3 px-4">
        <ColorInput
          className="w-full"
          value={settings.colorOfCurrentLine}
          label="Color of Selected Line"
          setValue={color => {
            setSettings({
              colorOfCurrentLine: color
            })
          }}
        />
        <FileInput
          enableUrl
          acceptedMimeTypes={{
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
          }}
          file={settings.bgImage}
          icon="tabler:photo"
          label="Background Image"
          preview={settings.bgImagePreview}
          setData={({ file, preview }) => {
            setSettings({
              bgImage: file,
              bgImagePreview: preview
            })
          }}
        />
        <SliderInput
          wrapperClassName="mb-8"
          icon="tabler:zoom-in-area"
          max={200}
          min={10}
          label="Background Image Scale"
          setValue={value => {
            setSettings({
              bgImageScale: value
            })
          }}
          step={10}
          value={settings.bgImageScale}
        />
        <div className="flex items-center justify-between">
          <div className="text-bg-500 flex items-center gap-2">
            <Icon className="size-6" icon="tabler:eye" />
            <span className="text-lg">Show background image</span>
          </div>
          <Switch
            checked={settings.showImage}
            onChange={() => {
              setSettings({
                showImage: !settings.showImage
              })
            }}
          />
        </div>
        <div className="mt-6 flex items-center justify-between">
          <div className="text-bg-500 flex items-center gap-2">
            <Icon className="size-6" icon="tabler:moon" />
            <span className="text-lg">Dark mode</span>
          </div>
          <Switch
            checked={settings.darkMode}
            onChange={() => {
              setSettings({
                darkMode: !settings.darkMode
              })
            }}
          />
        </div>
        <div className="mt-6 flex items-center gap-2">
          <Button
            className="w-1/2"
            icon="uil:import"
            variant="secondary"
            onClick={importData}
          >
            Import
          </Button>
          <Button
            className="w-1/2"
            icon="uil:export"
            variant="secondary"
            onClick={exportData}
          >
            Export
          </Button>
        </div>
        <Button
          dangerous
          className="-mt-2 w-full"
          icon="tabler:trash"
          variant="secondary"
          onClick={() => {
            open(ConfirmationModal, {
              title: 'Reset MRT Map',
              description:
                'Are you sure you want to reset the MRT map? This action cannot be undone.',
              onConfirm: async () => {
                setMrtLines([])
                setMrtStations([])
                setSettings({
                  bgImage: null,
                  bgImagePreview: null,
                  showImage: true,
                  darkMode: false
                })
                setSelectedLineIndex('path_drawing', null)
              }
            })
          }}
        >
          Reset MRT Map
        </Button>
      </div>
    </>
  )
}

export default SettingsSection
