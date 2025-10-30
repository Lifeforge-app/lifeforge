import { Button } from 'lifeforge-ui'

import { useAmenities } from '../../providers/AmenitiesProvider'
import { useDrawing } from '../../providers/DrawingProvider'
import type { Amenity } from '../../types'

interface AmenityListProps {
  amenities: Amenity[]
}

export function AmenityList({ amenities }: AmenityListProps) {
  const { setSelectedElementId } = useDrawing()

  const { amenityTypes } = useAmenities()

  return (
    <div className="space-y-2">
      {amenities.map(amenity => {
        const amenityType = amenityTypes.find(
          t => t.id === amenity.amenityTypeId
        )

        return (
          <Button
            key={amenity.id}
            className="w-full justify-start"
            icon={amenityType?.icon}
            variant="plain"
            onClick={() => {
              setSelectedElementId(amenity.id)
            }}
          >
            {amenityType?.name || 'Unknown Amenity'}
          </Button>
        )
      })}
      {amenities.length === 0 && (
        <p className="text-bg-500 text-center text-sm">
          No amenities on this floor
        </p>
      )}
    </div>
  )
}

export default AmenityList
