import { useSearchParams } from 'react-router'

import { MenuItem, SidebarItem } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import { type ITodoListList } from '../../../interfaces/todo_list_interfaces'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListList
  setSidebarOpen: (value: boolean) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    setSelectedList: setSelectedData,
    setModifyListModalOpenType: setModifyModalOpenType,
    setDeleteListConfirmationModalOpen: setDeleteConfirmationModalOpen
  } = useTodoListContext()

  return (
    <SidebarItem
      active={searchParams.get('list') === item.id}
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
      icon={item.icon}
      name={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        searchParams.delete('list')
        setSearchParams(searchParams)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setSearchParams({
          ...Object.fromEntries(searchParams.entries()),
          list: item.id
        })
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskListListItem
