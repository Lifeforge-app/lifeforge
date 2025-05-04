import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { ITodoListList } from '../interfaces/todo_list_interfaces'

function ModifyListModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    existedData: ITodoListList | null
  }
  onClose: () => void
}) {
  const [data, setData] = useState({
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: 'List name',
      icon: 'tabler:list',
      placeholder: 'List name',
      type: 'text'
    },
    {
      id: 'icon',
      required: true,
      label: 'List icon',
      type: 'icon'
    },
    {
      id: 'color',
      required: true,
      label: 'List color',
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({
        name: '',
        icon: '',
        color: '#FFFFFF'
      })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/lists"
      fields={FIELDS}
      icon={`${
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[type!]
      }`}
      id={existedData?.id}
      namespace="apps.todoList"
      openType={type}
      queryKey={['todo-list', 'lists']}
      setData={setData}
      title={`list.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyListModal
