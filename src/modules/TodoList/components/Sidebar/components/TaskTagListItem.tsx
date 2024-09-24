import React from 'react'
import { useSearchParams } from 'react-router-dom'
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
    setModifyTagModalOpenType: setModifyModalOpenType,
    setSelectedTag: setSelectedData,
    setDeleteTagConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <SidebarItem
      icon="tabler:hash"
      name={item.name}
      color={item.color}
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
        setSearchParams(searchParams => {
          searchParams.delete('tag')
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

export default TaskTagListItem
