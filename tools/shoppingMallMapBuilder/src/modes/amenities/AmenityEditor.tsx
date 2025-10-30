import { Icon } from '@iconify/react'
import { Button, GoBackButton, ListboxInput, ListboxOption } from 'lifeforge-ui'

import { useAmenities } from '../../providers/AmenitiesProvider'
import { useControlKeyState } from '../../providers/ControlKeyStateProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import type { useAmenity } from './useAmenity'

interface AmenityEditorProps {
  amenityState: ReturnType<typeof useAmenity>
  isDrawing: boolean
  onStartDrawing: () => void
}

export function AmenityEditor({
  amenityState,
  isDrawing,
  onStartDrawing
}: AmenityEditorProps) {
  const isControlPressed = useControlKeyState()

  const { clearDrawingAndDeselect } = useDrawing()

  const { amenityTypes } = useAmenities()

  const amenity = amenityState.selectedAmenity!

  const amenityType = amenityTypes.find(t => t.id === amenity.amenityTypeId)

  if (!amenityState.selectedAmenity) {
    return null
  }

  return (
    <>
      <GoBackButton onClick={clearDrawingAndDeselect} />
      <div className="border-bg-800 mt-4 rounded-md border-2 p-4">
        <div className="flex-between">
          <div className="flex w-full min-w-0 items-center gap-2">
            {amenityType && <Icon className="size-6" icon={amenityType.icon} />}
            <span className="w-full min-w-0 truncate text-lg font-medium">
              {amenityType?.name || 'Unknown Amenity'}
            </span>
          </div>
          <Button
            dangerous
            icon="tabler:trash"
            variant="plain"
            onClick={amenityState.handleDeleteAmenity}
          />
        </div>
        <ListboxInput
          buttonContent={
            <span>{amenityType?.name || 'Select Amenity Type'}</span>
          }
          className="mt-4"
          icon="tabler:category"
          label="Amenity Type"
          setValue={value => {
            amenityState.handleAmenityTypeChange(value as string)
          }}
          value={amenity.amenityTypeId}
        >
          {amenityTypes.map(type => (
            <ListboxOption
              key={type.id}
              icon={type.icon}
              label={type.name}
              value={type.id}
            />
          ))}
        </ListboxInput>

        <div className="border-bg-800 mt-4 space-y-2 rounded-md border-2 p-4">
          <div className="text-bg-500 mb-2 text-sm font-medium">
            Amenity Coordinates
          </div>
          <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
            <span className="text-bg-500 text-sm font-medium">X Coords</span>
            <input
              className="w-full"
              type="number"
              value={amenity.coordinate[0]}
              onChange={e =>
                amenityState.handleCoordinateChange(
                  0,
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
          <div className="component-bg-lighter w-full space-y-2 rounded-md p-3">
            <span className="text-bg-500 text-sm font-medium">Y Coords</span>
            <input
              className="w-full"
              type="number"
              value={amenity.coordinate[1]}
              onChange={e =>
                amenityState.handleCoordinateChange(
                  1,
                  parseFloat(e.target.value) || 0
                )
              }
            />
          </div>
        </div>

        {!isDrawing && (
          <Button
            className="mt-4 w-full"
            icon="tabler:pencil"
            variant="secondary"
            onClick={() => {
              onStartDrawing()
            }}
          >
            {isControlPressed ? 'Move Point' : 'Set Point'}
          </Button>
        )}

        {isDrawing && (
          <div className="border-bg-700 bg-bg-800 mt-4 space-y-2 rounded-md border p-4">
            <p className="text-bg-300 text-sm">
              Click on the map to place the amenity
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default AmenityEditor
