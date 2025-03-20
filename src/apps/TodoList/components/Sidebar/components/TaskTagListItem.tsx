import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

import { type ITodoListTag } from '../../../interfaces/todo_list_interfaces'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListTag
  setSidebarOpen: (value: boolean) => void
}) {
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
