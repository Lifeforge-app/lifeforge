import { FormModal, defineForm } from 'lifeforge-ui'

interface EditMallNameModalProps {
  currentName: string
  onSave: (name: string) => void
}

function EditMallNameModal({
  onClose,
  data: { currentName, onSave }
}: {
  onClose: () => void
  data: EditMallNameModalProps
}) {
  const { formProps } = defineForm<{ mallName: string }>({
    title: 'Edit Mall Name',
    icon: 'tabler:building-skyscraper',
    onClose,
    submitButton: 'update'
  })
    .typesMap({
      mallName: 'text'
    })
    .setupFields({
      mallName: {
        label: 'Mall Name',
        placeholder: 'Enter mall name',
        icon: 'tabler:building-skyscraper'
      }
    })
    .initialData({
      mallName: currentName
    })
    .onSubmit(async (values: { mallName: string }) => {
      onSave(values.mallName)
    })
    .build()

  return <FormModal {...formProps} />
}

export default EditMallNameModal
