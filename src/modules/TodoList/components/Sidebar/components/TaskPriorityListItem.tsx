import React from 'react'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
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
    searchParams,
    setSearchParams,
    setSelectedPriority: setSelectedData,
    setModifyPriorityModalOpenType: setModifyModalOpenType,
    setDeletePriorityConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      name={item.name}
      sideStripColor={item.color}
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
        searchParams.delete('priority')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
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
