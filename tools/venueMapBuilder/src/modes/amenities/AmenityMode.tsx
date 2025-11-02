import { Icon } from '@iconify/react'
import {
  Button,
  ListboxInput,
  ListboxOption,
  useModalStore
} from 'lifeforge-ui'

import AddAmenityTypeModal from '../../components/modals/AddAmenityTypeModal'
import { useAmenities } from '../../providers/AmenitiesProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import { useFloors } from '../../providers/FloorsProvider'
import AmenityEditor from './AmenityEditor'
import AmenityList from './AmenityList'
import type { useAmenity } from './useAmenity'

function AmenityMode({
  amenityState,
  onStartDrawing
}: {
  amenityState: ReturnType<typeof useAmenity>
  onStartDrawing: () => void
}) {
  const { open } = useModalStore(state => state)

  const { isDrawing, selectedElementId } = useDrawing()

  const { selectedFloor } = useFloors()

  const {
    amenityTypes,
    addAmenityType,
    selectedAmenityTypeId,
    setSelectedAmenityTypeId
  } = useAmenities()

  const handleCreateAmenityType = (id: string, name: string, icon: string) => {
    addAmenityType({ id, name, icon })
    setSelectedAmenityTypeId(id)
  }

  const handleAmenityTypeSelect = (value: string | number) => {
    const typeId = value as string

    if (typeId === 'new-amenity-type') {
      open(AddAmenityTypeModal, {
        onCreateAmenityType: handleCreateAmenityType
      })

      return
    }

    setSelectedAmenityTypeId(typeId)
  }

  const handleNewAmenity = () => {
    if (!selectedAmenityTypeId) return
    amenityState.handleNewAmenity(selectedAmenityTypeId)
  }

  const selectedAmenityType = amenityTypes.find(
    t => t.id === selectedAmenityTypeId
  )

  return (
    <div className="overflow-y-auto">
      {!selectedElementId && (
        <div className="mb-6 space-y-2">
          <ListboxInput
            buttonContent={
              <div className="flex items-center gap-2">
                {selectedAmenityType ? (
                  <>
                    <Icon className="size-5" icon={selectedAmenityType.icon} />
                    <span>{selectedAmenityType.name}</span>
                  </>
                ) : (
                  <span>Select Amenity Type</span>
                )}
              </div>
            }
            icon="tabler:category"
            label="Amenity Type"
            setValue={handleAmenityTypeSelect}
            value={selectedAmenityTypeId || ''}
          >
            {amenityTypes.map(type => (
              <ListboxOption
                key={type.id}
                icon={type.icon}
                label={type.name}
                value={type.id}
              />
            ))}
            <ListboxOption
              key="new-amenity-type"
              icon="tabler:plus"
              label="New Amenity Type"
              value="new-amenity-type"
            />
          </ListboxInput>

          <Button
            className="mt-4 w-full"
            icon={
              selectedAmenityType ? selectedAmenityType.icon : 'tabler:plus'
            }
            onClick={handleNewAmenity}
          >
            Add {selectedAmenityType ? selectedAmenityType.name : 'Amenity'}
          </Button>
        </div>
      )}

      {!amenityState.selectedAmenity ? (
        <AmenityList amenities={selectedFloor.amenities} />
      ) : (
        <AmenityEditor
          amenityState={amenityState}
          isDrawing={isDrawing}
          onStartDrawing={onStartDrawing}
        />
      )}
    </div>
  )
}

export default AmenityMode
