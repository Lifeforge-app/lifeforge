import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { ITodoPriority } from '../interfaces/todo_list_interfaces'

function ModifyPriorityModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ITodoPriority | null
  }
  onClose: () => void
}) {
  const [data, setData] = useState({
    name: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: 'Priority name',
      icon: 'tabler:sort-ascending-numbers',
      placeholder: 'Priority name',
      type: 'text'
    },
    {
      id: 'color',
      required: true,
      label: 'Priority color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        color: '#FFFFFF'
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/priorities"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }
      id={existedData?.id}
      namespace="apps.todoList"
      openType={type}
      queryKey={['todo-list', 'priorities']}
      setData={setData}
      title={`priority.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyPriorityModal
