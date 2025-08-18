import { FormModal, defineForm } from 'lifeforge-ui'
import React from 'react'

import type { Line } from '../typescript/mrt.interfaces'

function ModifyLineModal({
  onClose,
  data: { type, setLineData, index, initialData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    setLineData: React.Dispatch<React.SetStateAction<Line[]>>
    index?: number
    initialData?: Partial<Line>
  }
}) {
  const formProps = defineForm<{
    name: string
    color: string
  }>({
    title: `${type === 'create' ? 'Create' : 'Update'} MRT Line`,
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',

    onClose,
    submitButton: 'create'
  })
    .typesMap({
      name: 'text',
      color: 'color',
      code: 'text'
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
      },
      code: {
        label: 'Line Code',
        placeholder: 'Enter line code',
        required: true,
        icon: 'tabler:hash'
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
            code: data.code,
            color: data.color
          }

          return newData
        }

        return [
          ...prev,
          { name: data.name, color: data.color, code: data.code, path: [] }
        ]
      })
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyLineModal
