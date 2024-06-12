import React from 'react'
import { useTodoListContext } from '@providers/TodoListProvider'
import type { ITodoSubtask } from '@interfaces/todo_list_interfaces'
import APIRequest from '@utils/fetchData'
import TaskCompletionCheckbox from './TaskCompletionCheckbox'

function SubtaskItem({
  entry,
  parentId
}: {
  entry: ITodoSubtask
  parentId: string
}): React.ReactElement {
  const { setEntries, entries, refreshEntries } = useTodoListContext()

  async function toggleSubTaskCompletion(): Promise<void> {
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

    await APIRequest({
      endpoint: `todo-list/subtask/toggle/${entry.id}`,
      method: 'PATCH',
      failureInfo: "Couldn't update the task. Please try again.",
      onFailure: () => {
        if (refreshEntries !== undefined) {
          refreshEntries()
        }
      }
    })
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-bg-900 p-6">
      {entry.title}
      <TaskCompletionCheckbox
        toggleTaskCompletion={() => {
          toggleSubTaskCompletion().catch(console.error)
        }}
        entry={entry}
      />
    </div>
  )
}

export default SubtaskItem
