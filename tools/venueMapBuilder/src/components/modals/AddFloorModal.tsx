import { FormModal, defineForm } from 'lifeforge-ui'

function AddFloorModal({
  onClose,
  data: { onCreateFloor }
}: {
  onClose: () => void
  data: { onCreateFloor: (floorId: string, floorName: string) => void }
}) {
  const { formProps } = defineForm<{ floorName: string; floorId: string }>({
    title: 'Add New Floor',
    icon: 'tabler:plus',
    onClose,
    submitButton: 'create'
  })
    .typesMap({
      floorId: 'text',
      floorName: 'text'
    })
    .setupFields({
      floorId: {
        label: 'Floor Abbreviation',
        placeholder: 'e.g., G, L1, B',
        icon: 'tabler:number-123'
      },
      floorName: {
        label: 'Floor Name',
        placeholder: 'e.g., Ground Floor, Level 1, Basement',
        icon: 'uil:layers'
      }
    })
    .onSubmit(async values => onCreateFloor(values.floorId, values.floorName))
    .build()

  return <FormModal {...formProps} />
}

export default AddFloorModal
