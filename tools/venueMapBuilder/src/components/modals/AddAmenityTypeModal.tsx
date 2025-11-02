import { FormModal, defineForm } from 'lifeforge-ui'

function AddAmenityTypeModal({
  onClose,
  data: { onCreateAmenityType }
}: {
  onClose: () => void
  data: {
    onCreateAmenityType: (id: string, name: string, icon: string) => void
  }
}) {
  const { formProps } = defineForm<{
    amenityId: string
    amenityName: string
    amenityIcon: string
  }>({
    title: 'Add New Amenity Type',
    icon: 'tabler:plus',
    onClose,
    submitButton: 'create'
  })
    .typesMap({
      amenityId: 'text',
      amenityName: 'text',
      amenityIcon: 'icon'
    })
    .setupFields({
      amenityId: {
        label: 'Amenity ID',
        placeholder: 'e.g., toilet, parking, elevator',
        icon: 'tabler:id'
      },
      amenityName: {
        label: 'Amenity Name',
        placeholder: 'e.g., Toilet, Parking, Elevator',
        icon: 'tabler:tag'
      },
      amenityIcon: {
        label: 'Icon Name'
      }
    })
    .onSubmit(async values =>
      onCreateAmenityType(
        values.amenityId,
        values.amenityName,
        values.amenityIcon
      )
    )
    .build()

  return <FormModal {...formProps} />
}

export default AddAmenityTypeModal
