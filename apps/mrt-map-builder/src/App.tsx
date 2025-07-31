import { Icon } from '@iconify/react/dist/iconify.js'
import {
  Button,
  ContentWrapperWithSidebar,
  LayoutWithSidebar,
  SidebarDivider,
  SidebarWrapper
} from 'lifeforge-ui'
import { useRef, useState } from 'react'
import { usePersonalization } from 'shared'

import LineSection from './components/sidebar/LineSection'
import SettingsSection from './components/sidebar/SettingsSection'
import StationSection from './components/sidebar/StationSection'
import useCanvasEvents from './hooks/useCanvasEvents'
import useKeyboardEvents from './hooks/useKeyboardEvents'
import usePersistence from './hooks/usePersistence'
import useRendering from './hooks/useRendering'
import type { Line, Settings, Station } from './typescript/mrt.interfaces'

const D3MRTMap = () => {
  const { bgTempPalette } = usePersonalization()

  const ref = useRef(null)

  const gRef = useRef(null)

  const [currentlyWorking, _setCurrentWorking] = useState<'station' | 'line'>(
    'line'
  )

  const currentWorkingRef = useRef<'station' | 'line'>(currentlyWorking)

  function setCurrentWorking(plotting: 'station' | 'line') {
    currentWorkingRef.current = plotting
    _setCurrentWorking(plotting)
  }

  const [selectedLineIndex, _setSelectedLineIndex] = useState<{
    index: number | null
    type: 'path_drawing' | 'station_plotting'
  }>(
    localStorage.getItem('mrtSelectedLineIndex')
      ? JSON.parse(
          localStorage.getItem('mrtSelectedLineIndex') ??
            '{"index": null, "type": "path_drawing"}'
        )
      : null
  )

  const selectedLineIndexRef = useRef(selectedLineIndex)

  function setSelectedLineIndex(
    type: 'path_drawing' | 'station_plotting',
    index: number | null
  ) {
    selectedLineIndexRef.current = { index, type }
    _setSelectedLineIndex({ index, type })
  }

  const [settings, _setSettings] = useState<Settings>(
    localStorage.getItem('settings')
      ? JSON.parse(
          localStorage.getItem('settings') ??
            `{
              "showImage": false,
              "bgImagePreview": "",
              "bgImageScale": 100,
              "colorOfCurrentLine": "${bgTempPalette[0]}",
              "darkMode": false
            }`
        )
      : {
          showImage: false,
          bgImagePreview: '',
          bgImageScale: 100,
          colorOfCurrentLine: bgTempPalette[0],
          darkMode: false
        }
  )

  const setSettings = (newSettings: Partial<typeof settings>) => {
    _setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const [mrtStations, setMrtStations] = useState<Station[]>(
    localStorage.getItem('mrtStations')
      ? JSON.parse(localStorage.getItem('mrtStations') ?? '[]')
      : []
  )

  const [mrtLines, setMrtLines] = useState<Line[]>(
    localStorage.getItem('mrtLines')
      ? JSON.parse(localStorage.getItem('mrtLines') ?? '[]')
      : []
  )

  const importData = () => {
    const input = document.createElement('input')

    input.type = 'file'
    input.accept = 'application/json'

    input.onchange = async event => {
      const file = (event.target as HTMLInputElement).files?.[0]

      if (!file) return

      const text = await file.text()

      const data = JSON.parse(text)

      setMrtLines(data.mrtLines)
      setMrtStations(data.mrtStations)
      setSettings(data.settings)
      setSelectedLineIndex(
        data.selectedLineIndex.type,
        data.selectedLineIndex.index
      )
    }
    input.click()
  }

  const exportData = () => {
    const data = {
      mrtLines,
      mrtStations,
      settings: {
        ...settings,
        bgImage: null,
        bgImagePreview: null
      },
      selectedLineIndex
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = 'mrt-map-data.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  useCanvasEvents({
    ref,
    gRef,
    selectedLineIndexRef,
    setMrtLines,
    currentWorkingRef
  })

  useRendering({
    gRef,
    mrtLines,
    mrtStations,
    settings,
    selectedLineIndex,
    currentlyWorking,
    setMrtStations
  })

  useKeyboardEvents({
    selectedLineIndex,
    setMrtLines,
    setMrtStations,
    currentlyWorking
  })

  usePersistence({
    mrtLines,
    mrtStations,
    settings,
    selectedLineIndex
  })

  return (
    <main
      className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex h-dvh w-full flex-col p-8 pb-0"
      id="app"
    >
      <LayoutWithSidebar>
        <SidebarWrapper isOpen={true} setOpen={() => {}}>
          <div className="mb-4 flex items-center gap-4 px-4">
            <Icon className="text-2xl" icon="tabler:mouse" />
            <h2 className="text-xl font-medium">Currently Working On</h2>
          </div>
          <div className="flex items-center gap-2 px-4">
            <Button
              className="w-full"
              icon="tabler:line"
              variant={currentlyWorking === 'line' ? 'primary' : 'plain'}
              onClick={() => {
                setCurrentWorking('line')
                setSelectedLineIndex('path_drawing', null)
              }}
            >
              Line
            </Button>
            <Button
              className="w-full"
              icon="tabler:train"
              variant={currentlyWorking === 'station' ? 'primary' : 'plain'}
              onClick={() => {
                setCurrentWorking('station')
                setSelectedLineIndex('path_drawing', null)
              }}
            >
              Station
            </Button>
          </div>
          <SidebarDivider />
          {currentlyWorking === 'line' ? (
            <LineSection
              mrtLines={mrtLines}
              selectedLineIndex={selectedLineIndex}
              setMrtLines={setMrtLines}
              setSelectedLineIndex={setSelectedLineIndex}
            />
          ) : (
            <StationSection
              mrtLines={mrtLines}
              mrtStations={mrtStations}
              setMrtStations={setMrtStations}
            />
          )}
          <SidebarDivider />
          <SettingsSection
            exportData={exportData}
            importData={importData}
            setMrtLines={setMrtLines}
            setMrtStations={setMrtStations}
            setSelectedLineIndex={setSelectedLineIndex}
            setSettings={setSettings}
            settings={settings}
          />
        </SidebarWrapper>
        <ContentWrapperWithSidebar>
          <div className="component-bg mb-8 h-full overflow-hidden rounded-lg">
            <svg
              ref={ref}
              height="100%"
              style={{ touchAction: 'none' }}
              width="100%"
            >
              <g ref={gRef}></g>
            </svg>
          </div>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </main>
  )
}

export default D3MRTMap
