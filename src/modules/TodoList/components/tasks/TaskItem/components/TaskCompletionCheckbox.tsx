import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import {
  type ITodoListEntry,
  type ITodoSubtask
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
      className={clsx(
        'flex-center relative z-50 size-5 rounded-full ring-2 ring-offset-2 ring-offset-bg-50 transition-all hover:border-custom-500 dark:ring-offset-bg-900',
        entry.done ? 'ring-custom-500' : 'ring-bg-200 dark:ring-bg-500'
      )}
      onClick={() => {
        toggleTaskCompletion(entry.id)
      }}
    >
      {entry.done && (
        <Icon
          className="size-4 stroke-custom-500 stroke-1 text-custom-500"
          icon="uil:check"
        />
      )}
    </button>
  )
}

export default TaskCompletionCheckbox
