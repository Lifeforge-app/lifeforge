import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import ModifyTagModal from '@apps/TodoList/modals/ModifyTagModal'
import {
  type TodoListTag,
  useTodoListContext
} from '@apps/TodoList/providers/TodoListProvider'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: TodoListTag
  setSidebarOpen: (value: boolean) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { filter, setFilter } = useTodoListContext()

  const handleUpdateTag = useCallback(() => {
    open(ModifyTagModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const deleteMutation = useMutation(
    forgeAPI.todoList.tags.remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['todo-list'] })

          if (item.id === filter.tag) {
            setFilter('tag', null)
          }
        },
        onError: () => {
          toast.error(
            'An error occurred while deleting the tag. Please try again later.'
          )
        }
      })
  )

  const handleDeleteTag = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Tag',
      description:
        'Are you sure you want to delete this tag? The tasks with this tag will not be deleted.',
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
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
      number={item.amount}
      onCancelButtonClick={() => {
        setFilter('tag', null)
        setSidebarOpen(false)
      }}
      onClick={() => {
        setFilter('tag', item.id)
        setSidebarOpen(false)
      }}
    />
  )
}

export default TaskTagListItem
