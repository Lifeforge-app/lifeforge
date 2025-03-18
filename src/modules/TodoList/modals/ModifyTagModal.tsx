import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

function ModifyTagModal() {
  const {
    modifyTagModalOpenType: openType,
    setModifyTagModalOpenType: setOpenType,
    selectedTag
  } = useTodoListContext()
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
    if (openType === 'update' && selectedTag !== null) {
      setData(selectedTag)
    } else {
      setData({ name: '' })
    }
  }, [openType, selectedTag])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/tags"
      fields={FIELDS}
      icon="tabler:tag"
      id={selectedTag?.id}
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      queryKey={['todo-list', 'tags']}
      setData={setData}
      title={`tag.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyTagModal
