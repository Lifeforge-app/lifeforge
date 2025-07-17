import { FormModal } from 'lifeforge-ui'
import { type IFieldProps } from 'lifeforge-ui'
import { useEffect, useState } from 'react'

import { ITodoListTag } from '../interfaces/todo_list_interfaces'

function ModifyTagModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'create' | 'update' | null
    existedData: ITodoListTag | null
  }
  onClose: () => void
}) {
  const [data, setData] = useState({
    name: ''
  })

  const FIELDS: IFieldProps<typeof data>[] = [
    {
      id: 'name',
      required: true,
      label: 'Tag name',
      icon: 'tabler:tag',
      placeholder: 'Tag name',
      type: 'text'
    }
  ]

  useEffect(() => {
    if (type === 'update' && existedData !== null) {
      setData(existedData)
    } else {
      setData({ name: '' })
    }
  }, [type, existedData])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/tags"
      fields={FIELDS}
      icon="tabler:tag"
      id={existedData?.id}
      namespace="apps.todoList"
      openType={type}
      queryKey={['todo-list', 'tags']}
      setData={setData}
      title={`tag.${type}`}
      onClose={onClose}
    />
  )
}

export default ModifyTagModal
