import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

function ModifyPriorityModal() {
  const {
    modifyPriorityModalOpenType: openType,
    setModifyPriorityModalOpenType: setOpenType,
    selectedPriority
  } = useTodoListContext()
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
    if (openType === 'update' && selectedPriority !== null) {
      setData(selectedPriority)
    } else {
      setData({
        name: '',
        color: '#FFFFFF'
      })
    }
  }, [openType, selectedPriority])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/priorities"
      fields={FIELDS}
      icon={
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }
      id={selectedPriority?.id}
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      queryKey={['todo-list', 'priorities']}
      setData={setData}
      title={`priority.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyPriorityModal
