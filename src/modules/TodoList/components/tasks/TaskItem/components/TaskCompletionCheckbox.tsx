import { Icon } from '@iconify/react'
import React from 'react'
import { type ITodoListEntry } from '@typedec/TodoList'

function TaskCompletionCheckbox({
  entry,
  toggleTaskCompletion
}: {
  entry: ITodoListEntry
  toggleTaskCompletion: (id: string) => void
}): React.ReactElement {
  return (
    <button
      onClick={() => {
        toggleTaskCompletion(entry.id)
      }}
      className={`flex-center relative z-50 flex h-5 w-5 rounded-full ring-2 ring-offset-2 ring-offset-bg-50 transition-all hover:border-custom-500 dark:ring-offset-bg-900 ${
        entry.done ? 'ring-custom-500' : 'bg-bg-50 ring-bg-500 dark:bg-bg-900'
      }`}
    >
      {entry.done && (
        <Icon
          icon="uil:check"
          className="h-4 w-4 stroke-custom-500 stroke-1 text-custom-500"
        />
      )}
    </button>
  )
}

export default TaskCompletionCheckbox
