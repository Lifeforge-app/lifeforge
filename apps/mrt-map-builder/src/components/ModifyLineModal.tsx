import { FormModal, defineForm } from 'lifeforge-ui'
import React from 'react'

function ModifyLineModal({
  onClose,
  data: { type, setLineData, index, initialData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    setLineData: React.Dispatch<
      React.SetStateAction<
        {
          name: string
          color: string
          path: [number, number][]
        }[]
      >
    >
    index?: number
    initialData?: {
      name: string
      color: string
    }
  }
}) {
  const formProps = defineForm<{
    name: string
    color: string
  }>()
    .ui({
      title: `${type === 'create' ? 'Create' : 'Update'} MRT Line`,
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      namespace: false,
      onClose,
      submitButton: 'create'
    })
    .typesMap({
      name: 'text',
      color: 'color'
    })
    .setupFields({
      name: {
        label: 'Line Name',
        placeholder: 'Enter line name',
        required: true,
        icon: 'tabler:route'
      },
      color: {
        label: 'Line Color',
        required: true
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      setLineData(prev => {
        if (index !== undefined) {
          const newData = [...prev]

          newData[index] = {
            ...newData[index],
            name: data.name,
            color: data.color
          }

          return newData
        }

        return [...prev, { name: data.name, color: data.color, path: [] }]
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyLineModal
