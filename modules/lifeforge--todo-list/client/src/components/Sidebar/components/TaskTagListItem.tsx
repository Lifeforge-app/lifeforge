import { useCallback } from 'react'

import { useForgeMutation } from '@lifeforge/api'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from '@lifeforge/ui'

import { forgeAPI } from '@/manifest'
import ModifyTagModal from '@/modals/ModifyTagModal'
import {
  type TodoListTag,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TaskTagListItem({ item }: { item: TodoListTag }) {
  const { open } = useModalStore()
  const { filter, setFilter } = useTodoListContext()

  const handleUpdateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const deleteMutation = useForgeMutation(
    forgeAPI.tags.remove.input({ id: item.id }),
    {
      action: 'delete',
      queryKey: forgeAPI.key,
      onSuccess: () => {
        if (item.id === filter.tag) {
          setFilter('tag', null)
        }
      }
    }
  )

  const handleDeleteTag = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Tag',
      description:
        'Are you sure you want to delete this tag? The tasks with this tag will not be deleted.',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync(undefined)
      }
    })
  }, [item])

  return (
    <SidebarItem
      active={filter.tag === item.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleUpdateTag}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeleteTag}
          />
        </>
      }
      icon="tabler:hash"
      label={item.name}
      namespace={false}
      number={item.amount}
      onCancelButtonClick={() => {
        setFilter('tag', null)
      }}
      onClick={() => {
        setFilter('tag', item.id)
      }}
    />
  )
}

export default TaskTagListItem
