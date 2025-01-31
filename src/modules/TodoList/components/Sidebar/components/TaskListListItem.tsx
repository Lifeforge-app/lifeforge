import React from 'react'
import { useSearchParams } from 'react-router-dom'
import MenuItem from '@components/buttons/HamburgerMenu/components/MenuItem'
import { SidebarItem } from '@components/layouts/sidebar'
import { type ITodoListList } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListList
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    setSelectedList: setSelectedData,
    setModifyListModalOpenType: setModifyModalOpenType,
    setDeleteListConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      icon={item.icon}
      name={item.name}
      sideStripColor={item.color}
      active={searchParams.get('list') === item.id}
      number={item.amount}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          list: item.id
        })
        setSidebarOpen(false)
      }}
      onCancelButtonClick={() => {
        searchParams.delete('list')
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

export default TaskListListItem
