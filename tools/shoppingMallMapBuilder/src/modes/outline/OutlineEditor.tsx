import { Icon } from '@iconify/react'
import {
  Button,
  ColorInput,
  GoBackButton,
  NumberInput,
  TextInput
} from 'lifeforge-ui'

import { useControlKeyState } from '../../providers/ControlKeyStateProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import type { useOutline } from './useOutline'

interface OutlineEditorProps {
  outlineState: ReturnType<typeof useOutline>
  isDrawing: boolean
  onStartDrawing: () => void
  onFinishDrawing: () => void
}

export function OutlineEditor({
  isDrawing,
  outlineState,
  onStartDrawing,
  onFinishDrawing
}: OutlineEditorProps) {
  const isControlPressed = useControlKeyState()

  const { newCoordinates, clearDrawingAndDeselect: clearDrawing } = useDrawing()

  const outline = outlineState.selectedOutline!

  return (
    <>
      <GoBackButton onClick={clearDrawing} />
      <div className="border-bg-800 mt-4 rounded-md border-2 p-4">
        <div className="flex-between">
          <div className="flex items-center gap-2">
            <Icon className="size-6" icon="tabler:building" />
            <span className="text-lg font-medium">
              {outline.name || 'Unnamed Outline'}
            </span>
          </div>
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={outlineState.handleDeleteOutline}
          />
        </div>
        <TextInput
          className="mt-4"
          icon="tabler:tag"
          label="Outline Name"
          placeholder="Building Outline"
          setValue={outlineState.handleOutlineNameChange}
          value={outline.name}
        />
        <ColorInput
          className="mt-4"
          label="Line Color"
          setValue={outlineState.handleOutlineColorChange}
          value={outline.color || '#374151'}
        />
        <NumberInput
          className="mt-4"
          icon="tabler:line-height"
          label="Stroke Width"
          setValue={outlineState.handleOutlineStrokeWidthChange}
          value={outline.strokeWidth || 2}
        />
        {outline.segments.length > 0 && (
          <div className="border-bg-800 mt-4 space-y-2 rounded-md border-2 p-4">
            <div className="flex-between mb-2">
              <span className="text-bg-500 text-sm font-medium">
                Line Segments ({outline.segments.length} points)
              </span>
            </div>
            {outline.segments.map((segment, index) => (
              <div
                key={index}
                className="border-bg-800 flex items-center gap-2 rounded-md border-2 p-2"
              >
                <div className="space-y-2">
                  <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
                    <span className="text-bg-500 text-sm font-medium">
                      X Coords
                    </span>
                    <input
                      className="w-full"
                      type="number"
                      value={segment[0]}
                      onChange={e =>
                        outlineState.handleSegmentChange(
                          index,
                          0,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
                    <span className="text-bg-500 text-sm font-medium">
                      Y Coords
                    </span>
                    <input
                      className="w-full"
                      type="number"
                      value={segment[1]}
                      onChange={e =>
                        outlineState.handleSegmentChange(
                          index,
                          1,
                          parseFloat(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    dangerous
                    className="w-full"
                    icon="tabler:trash"
                    variant="plain"
                    onClick={() => {
                      outlineState.handleSegmentDelete(index)
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              dangerous
              className="mt-2 w-full"
              icon="tabler:trash"
              variant="secondary"
              onClick={outlineState.handleClearSegments}
            >
              Clear All Segments
            </Button>
          </div>
        )}
        <div className="mt-4 space-y-2">
          {isDrawing ? (
            <>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:info-circle" />
                <span>
                  {isControlPressed
                    ? 'Drawing mode (pan enabled)'
                    : 'Drawing mode (pan disabled)'}
                </span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:hand-click" />
                <span>Click on the map to add points</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:keyboard" />
                <span>
                  Press Enter to finish ({newCoordinates.length} points)
                </span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:keyboard" />
                <span>Press Z to undo last point</span>
              </div>
              <div className="text-bg-500 flex items-center gap-2 text-sm">
                <Icon icon="tabler:hand-grab" />
                <span>Hold Control to enable panning</span>
              </div>
              <Button
                className="mt-6 w-full"
                icon="tabler:check"
                variant="secondary"
                onClick={onFinishDrawing}
              >
                Finish Drawing
              </Button>
            </>
          ) : (
            <>
              <div className="mt-4 space-y-2">
                <div className="text-bg-500 flex items-center gap-2 text-sm">
                  <Icon icon="tabler:plus" />
                  <span>Press N to start drawing new line</span>
                </div>
                <div className="text-bg-500 flex items-center gap-2 text-sm">
                  <Icon className="shrink-0" icon="tabler:pencil-plus" />
                  <span>
                    Hold Control while clicking the button below to append to
                    existing points
                  </span>
                </div>
              </div>
              <Button
                className="mt-4 w-full"
                icon="tabler:pencil"
                onClick={onStartDrawing}
              >
                {isControlPressed ? 'Append Drawing' : 'Draw from Scratch'}
              </Button>
            </>
          )}
        </div>
      </div>
    </>
  )
}
