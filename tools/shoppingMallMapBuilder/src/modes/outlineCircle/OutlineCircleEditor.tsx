import { Icon } from '@iconify/react'
import {
  Button,
  ColorInput,
  GoBackButton,
  NumberInput,
  TextInput
} from 'lifeforge-ui'

import { useDrawing } from '../../providers/DrawingProvider'
import type { useOutlineCircle } from './useOutlineCircle'

interface OutlineCircleEditorProps {
  circleState: ReturnType<typeof useOutlineCircle>
  isDrawing: boolean
  onStartDrawing: () => void
}

export function OutlineCircleEditor({
  circleState,
  isDrawing,
  onStartDrawing
}: OutlineCircleEditorProps) {
  const { clearDrawingAndDeselect } = useDrawing()

  const circle = circleState.selectedCircle!

  return (
    <>
      <GoBackButton onClick={clearDrawingAndDeselect} />
      <div className="border-bg-800 mt-4 rounded-md border-2 p-4">
        <div className="flex-between">
          <div className="flex items-center gap-2">
            <Icon className="size-6" icon="tabler:circle" />
            <span className="text-lg font-medium">
              {circle.name || 'Unnamed Circle'}
            </span>
          </div>
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={circleState.handleDeleteCircle}
          />
        </div>
        <TextInput
          className="mt-4"
          icon="tabler:tag"
          label="Circle Name"
          placeholder="Circle Outline"
          setValue={circleState.handleCircleNameChange}
          value={circle.name}
        />
        <ColorInput
          className="mt-4"
          label="Line Color"
          setValue={circleState.handleCircleColorChange}
          value={circle.color || '#374151'}
        />
        <NumberInput
          className="mt-4"
          icon="tabler:line-height"
          label="Stroke Width"
          setValue={circleState.handleCircleStrokeWidthChange}
          value={circle.strokeWidth || 2}
        />

        <div className="border-bg-800 mt-4 space-y-2 rounded-md border-2 p-4">
          <div className="flex-between mb-2">
            <span className="text-bg-500 text-sm font-medium">
              Circle Properties
            </span>
          </div>

          <div className="space-y-2">
            <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
              <span className="text-bg-500 text-sm font-medium">Center X</span>
              <input
                className="w-full"
                type="number"
                value={circle.center[0]}
                onChange={e =>
                  circleState.handleCircleCenterChange(
                    0,
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
              <span className="text-bg-500 text-sm font-medium">Center Y</span>
              <input
                className="w-full"
                type="number"
                value={circle.center[1]}
                onChange={e =>
                  circleState.handleCircleCenterChange(
                    1,
                    parseFloat(e.target.value) || 0
                  )
                }
              />
            </div>
            <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
              <span className="text-bg-500 text-sm font-medium">Radius</span>
              <input
                className="w-full"
                min="1"
                type="number"
                value={circle.radius}
                onChange={e =>
                  circleState.handleCircleRadiusChange(
                    parseFloat(e.target.value) || 1
                  )
                }
              />
            </div>
          </div>
        </div>

        {!isDrawing ? (
          <>
            <div className="mt-4 space-y-2">
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:info-circle" />
                <span>Click to set center, then drag to set radius</span>
              </div>
            </div>
            <Button
              className="mt-4 w-full"
              icon="tabler:pointer"
              onClick={onStartDrawing}
            >
              Draw Circle
            </Button>
          </>
        ) : (
          <>
            <div className="mt-4 space-y-2">
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:hand-click" />
                <span>Click to set center point</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:arrows-move" />
                <span>Drag to set radius, then release</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
