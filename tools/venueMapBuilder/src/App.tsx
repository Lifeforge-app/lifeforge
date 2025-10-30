import { ContentWrapperWithSidebar, LayoutWithSidebar } from 'lifeforge-ui'
import { useState } from 'react'

import { MapCanvas } from './components/MapCanvas'
import { Sidebar } from './components/Sidebar'
import useDrawingFuncs from './hooks/useDrawingFuncs'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import useUtilsFuncs from './hooks/useUtilsFuncs'
import { useAmenity } from './modes/amenities/useAmenity'
import { useOutline } from './modes/outline/useOutline'
import { useOutlineCircle } from './modes/outlineCircle/useOutlineCircle'
import { usePath } from './modes/path/usePath'
import { useUnit } from './modes/unit/useUnit'
import { useDrawing } from './providers/DrawingProvider'
import SVGRefProvider from './providers/SVGRefProvider'
import { type HighlightedCoord } from './types'

const App = () => {
  const [highlightedCoord, setHighlightedCoord] =
    useState<HighlightedCoord | null>(null)

  const { isConnectingNodes } = useDrawing()

  const unitState = useUnit()

  const outlineState = useOutline()

  const circleState = useOutlineCircle()

  const amenityState = useAmenity()

  const pathState = usePath()

  const { handlePerformUnitOCR, handleAlignCoordinates } = useUtilsFuncs({
    unitState
  })

  const { handleFinishDrawing, handleStartDrawing } = useDrawingFuncs({
    unitState,
    outlineState,
    amenityState,
    pathState
  })

  const handlePathNodeClick = (nodeId: string) => {
    if (isConnectingNodes) {
      pathState.handleToggleConnection(nodeId)
    }
  }

  useKeyboardShortcuts({
    onNewUnit: unitState.handleNewUnit,
    onNewOutline: outlineState.handleNewOutline,
    onNewOutlineCircle: circleState.handleNewCircle,
    onNewAmenity: amenityState.handleNewAmenity,
    onNewPathNode: pathState.handleNewNode,
    onFinishDrawing: handleFinishDrawing
  })

  return (
    <main
      className="bg-bg-200/50 text-bg-800 dark:bg-bg-900/50 dark:text-bg-50 flex h-dvh w-full flex-col p-8 pb-0"
      id="app"
    >
      <LayoutWithSidebar>
        <Sidebar
          amenityState={amenityState}
          circleState={circleState}
          outlineState={outlineState}
          pathState={pathState}
          unitState={unitState}
          onAlignCoordinates={handleAlignCoordinates}
          onFinishDrawing={handleFinishDrawing}
          onHighlightCoord={setHighlightedCoord}
          onPerformUnitOCR={handlePerformUnitOCR}
          onStartDrawing={handleStartDrawing}
        />
        <ContentWrapperWithSidebar>
          <SVGRefProvider>
            <MapCanvas
              highlightedCoord={highlightedCoord}
              onPathNodeClick={handlePathNodeClick}
            />
          </SVGRefProvider>
        </ContentWrapperWithSidebar>
      </LayoutWithSidebar>
    </main>
  )
}

export default App
