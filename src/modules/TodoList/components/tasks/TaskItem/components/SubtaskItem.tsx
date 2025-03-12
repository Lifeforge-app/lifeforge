import { toast } from 'react-toastify'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import fetchAPI from '@utils/fetchAPI'

import type { ITodoSubtask } from '../../../../interfaces/todo_list_interfaces'
import TaskCompletionCheckbox from './TaskCompletionCheckbox'

function SubtaskItem({
  entry,
  parentId
}: {
  entry: ITodoSubtask
  parentId: string
}) {
  const { setEntries, entries, refreshEntries } = useTodoListContext()

  async function toggleSubTaskCompletion() {
    if (typeof entries !== 'string' && setEntries !== undefined) {
      setEntries(
        entries.map(e =>
          e.id === parentId
            ? {
                ...e,
                subtasks: e.subtasks.map(subtask =>
                  subtask.id === entry.id
                    ? {
                        ...subtask,
                        done: !subtask.done
                      }
                    : subtask
                )
              }
            : e
        )
      )
    }

    try {
      await fetchAPI(`todo-list/subtasks/toggle/${entry.id}`, {
        method: 'PATCH'
      })
    } catch {
      if (refreshEntries !== undefined) {
        refreshEntries()
      }

      toast.error('Failed to update subtask completion status')
    }
  }

  return (
    <div className="flex-between bg-bg-50 shadow-custom dark:bg-bg-900 flex rounded-md p-6">
      {entry.title}
      <TaskCompletionCheckbox
        entry={entry}
        toggleTaskCompletion={() => {
          toggleSubTaskCompletion().catch(console.error)
        }}
      />
    </div>
  )
}

export default SubtaskItem
