import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { DeleteConfirmationModal, MenuItem, SidebarItem } from '@lifeforge/ui'
import { useModalStore } from '@lifeforge/ui'

import ModifyTagModal from '@apps/TodoList/modals/ModifyTagModal'

import { type ITodoListTag } from '../../../interfaces/todo_list_interfaces'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: ITodoListTag
  setSidebarOpen: (value: boolean) => void
}) {
  const open = useModalStore(state => state.open)
  const [searchParams, setSearchParams] = useSearchParams()

  const handleUpdateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'update',
      existedData: item
    })
  }, [item])

  const handleDeleteTag = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'todo-list/tags',
      confirmationText: 'Delete this tag',
      customText:
        'Are you sure you want to delete this tag? The tasks with this tag will not be deleted.',
      data: item,
      itemName: 'tag',
      queryKey: ['todo-list', 'tags']
    })
  }, [item])

  return (
    <SidebarItem
      active={searchParams.get('tag') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateTag}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteTag}
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
