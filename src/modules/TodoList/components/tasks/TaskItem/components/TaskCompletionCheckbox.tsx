import { Icon } from '@iconify/react'
import React from 'react'
import {
  type ITodoSubtask,
  type ITodoListEntry
} from '@interfaces/todo_list_interfaces'

function TaskCompletionCheckbox({
  entry,
  toggleTaskCompletion
}: {
  entry: ITodoListEntry | ITodoSubtask
  toggleTaskCompletion: (id: string) => void
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        toggleTaskCompletion(entry.id)
      }}
      className={`flex-center relative z-50 flex size-5 rounded-full ring-2 ring-offset-2 ring-offset-bg-50 transition-all hover:border-custom-500 dark:ring-offset-bg-900 ${
        entry.done ? 'ring-custom-500' : 'ring-bg-200 dark:ring-bg-300'
      }`}
    >
      {entry.done && (
        <Icon
          icon="uil:check"
          className="size-4 stroke-custom-500 stroke-1 text-custom-500"
        />
      )}
    </button>
  )
}

export default TaskCompletionCheckbox
