import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'

import { Checkbox } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import fetchAPI from '@utils/fetchAPI'

import type {
  ITodoListEntry,
  ITodoSubtask
} from '../../../../interfaces/todo_list_interfaces'

function SubtaskItem({
  entry,
  parentId
}: {
  entry: ITodoSubtask
  parentId: string
}) {
  const { entriesQueryKey } = useTodoListContext()
  const queryClient = useQueryClient()

  async function toggleSubTaskCompletion() {
    queryClient.setQueryData<ITodoListEntry[]>(entriesQueryKey, data => {
      if (data === undefined) {
        return
      }

      return data.map(list => {
        if (list.id === parentId) {
          return {
            ...list,
            subtasks: list.subtasks.map(subtask =>
              subtask.id === entry.id
                ? { ...subtask, done: !subtask.done }
                : subtask
            )
          }
        }

        return list
      })
    })

    try {
      await fetchAPI(`todo-list/subtasks/toggle/${entry.id}`, {
        method: 'PATCH'
      })
    } catch {
      queryClient.invalidateQueries({ queryKey: entriesQueryKey })
      toast.error('Failed to update subtask completion status')
    }
  }

  return (
    <div className="flex-between bg-bg-50 shadow-custom dark:bg-bg-900 flex rounded-md p-6">
      {entry.title}
      <Checkbox checked={entry.done} onChange={toggleSubTaskCompletion} />
    </div>
  )
}

export default SubtaskItem
