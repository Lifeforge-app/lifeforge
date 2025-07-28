import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  MenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { toast } from 'react-toastify'

import ModifyListModal from '@apps/TodoList/modals/ModifyListModal'
import type { TodoListList } from '@apps/TodoList/providers/TodoListProvider'

function TaskListListItem({
  item,
  setSidebarOpen
}: {
  item: TodoListList
  setSidebarOpen: (value: boolean) => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const [searchParams, setSearchParams] = useSearchParams()

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
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            list: ''
          })
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
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [item])

  return (
    <SidebarItem
      active={searchParams.get('list') === item.id}
      hamburgerMenuItems={
        <>
          <MenuItem
            icon="tabler:pencil"
            text="Edit"
            onClick={handleUpdateList}
          />
          <MenuItem
            isRed
            icon="tabler:trash"
            text="Delete"
            onClick={handleDeleteList}
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
