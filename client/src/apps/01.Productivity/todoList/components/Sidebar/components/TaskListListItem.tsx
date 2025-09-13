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

import ModifyListModal from '@apps/01.Productivity/todoList/modals/ModifyListModal'
import {
  type TodoListList,
  useTodoListContext
} from '@apps/01.Productivity/todoList/providers/TodoListProvider'

function TaskListListItem({ item }: { item: TodoListList }) {
  const queryClient = useQueryClient()

  const { filter, setFilter } = useTodoListContext()

  const open = useModalStore(state => state.open)

  const handleUpdateList = useCallback(() => {
    open(ModifyListModal, {
      type: 'update',
      initialData: item
    })
  }, [item])

  const deleteMutation = useMutation(
    forgeAPI.todoList.lists.remove
      .input({
        id: item.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['todo-list'] })

          if (filter.list === item.id) {
            setFilter('list', null)
          }
        },
        onError: () => {
          toast.error(
            'An error occurred while deleting the list. Please try again later.'
          )
        }
      })
  )

  const handleDeleteList = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete List',
      description: 'Are you sure you want to delete this list?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [item])

  return (
    <SidebarItem
      active={filter.list === item.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleUpdateList}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeleteList}
          />
        </>
      }
      icon={item.icon}
      label={item.name}
      number={item.amount}
      sideStripColor={item.color}
      onCancelButtonClick={() => {
        setFilter('list', null)
      }}
      onClick={() => {
        setFilter('list', item.id)
      }}
    />
  )
}

export default TaskListListItem
