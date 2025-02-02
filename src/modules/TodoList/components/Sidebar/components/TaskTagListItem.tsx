import React from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import { type ITodoListTag } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListTag
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedTag: setSelectedData,
    setDeleteTagConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      active={searchParams.get('tag') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setModifyModalOpenType('update')
            }}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={e => {
              e.stopPropagation()
              setSelectedData(item)
              setDeleteConfirmationModalOpen(true)
            }}
          />
        </>
      }
      icon="tabler:hash"
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        searchParams.delete('tag')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          tag: item.id
        })
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskTagListItem
