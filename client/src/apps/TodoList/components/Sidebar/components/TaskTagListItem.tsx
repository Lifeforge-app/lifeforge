import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import ModifyTagModal from '@apps/TodoList/modals/ModifyTagModal'
import type { TodoListTag } from '@apps/TodoList/providers/TodoListProvider'

function TaskTagListItem({
  item,
  setSidebarOpen
}: {
  item: TodoListTag
  setSidebarOpen: (value: boolean) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const [searchParams, setSearchParams] = useSearchParams()

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
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            tag: ''
          })
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
      active={searchParams.get('tag') === item.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateTag}
          />
          <ContextMenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteTag}
          />
        </>
      }
      icon="tabler:hash"
      label={item.name}
      number={item.amount}
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
