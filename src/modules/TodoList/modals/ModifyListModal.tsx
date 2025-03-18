import { useEffect, useState } from 'react'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

function ModifyListModal() {
  const {
    modifyListModalOpenType: openType,
    setModifyListModalOpenType: setOpenType,
    selectedList
  } = useTodoListContext()
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
    if (openType === 'update' && selectedList !== null) {
      setData(selectedList)
    } else {
      setData({
        name: '',
        icon: '',
        color: '#FFFFFF'
      })
    }
  }, [openType, selectedList])

  return (
    <FormModal
      data={data}
      endpoint="todo-list/lists"
      fields={FIELDS}
      icon={`${
        {
          create: 'tabler:plus',
          update: 'tabler:pencil'
        }[openType!]
      }`}
      id={selectedList?.id}
      isOpen={openType !== null}
      namespace="modules.todoList"
      openType={openType}
      queryKey={['todo-list', 'lists']}
      setData={setData}
      title={`list.${openType}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyListModal
