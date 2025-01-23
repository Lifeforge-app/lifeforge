import React from 'react'
import MenuItem from '@components/ButtonsAndInputs/HamburgerMenu/MenuItem'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { type ITodoListTag } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListTag
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const {
    searchParams,
    setSearchParams,
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedTag: setSelectedData,
    setDeleteTagConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      icon="tabler:hash"
      name={item.name}
      sideStripColor={item.color}
      active={searchParams.get('tag') === item.id}
      needTranslate={false}
      number={item.amount}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          tag: item.id
        })
        setSidebarOpen(false)
      }}
      onCancelButtonClick={() => {
        searchParams.delete('tag')
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

export default TaskTagListItem
