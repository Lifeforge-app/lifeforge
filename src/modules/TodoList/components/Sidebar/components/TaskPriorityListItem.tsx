import React from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { type ITodoPriority } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskPriorityListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoPriority
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    setSelectedPriority: setSelectedData,
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setDeletePriorityConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarItem
      name={item.name}
      color={item.color}
      active={searchParams.get('priority') === item.id}
      needTranslate={false}
      number={item.amount}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          priority: item.id
        })
        setSidebarOpen(false)
      }}
      onCancelButtonClick={() => {
        setSearchParams(searchParams => {
          searchParams.delete('priority')
          return searchParams
        })
        setSidebarOpen(false)
      }}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:edit"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setModifyModalOpenType('update')
            }}
            text="Edit"
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setDeleteConfirmationModalOpen(true)
            }}
            text="Delete"
          />
        </>
      }
    />
  )
}

export default TaskPriorityListItem
