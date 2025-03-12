import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'

import {
  type ITodoListEntry,
  type ITodoSubtask
} from '../../../../interfaces/todo_list_interfaces'

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
        'flex-center ring-offset-bg-50 hover:border-custom-500 dark:ring-offset-bg-900 relative z-50 size-5 rounded-full ring-2 ring-offset-2 transition-all',
        entry.done ? 'ring-custom-500' : 'ring-bg-200 dark:ring-bg-500'
      )}
      onClick={() => {
        toggleTaskCompletion(entry.id)
      }}
    >
      {entry.done && (
        <Icon
          className="stroke-custom-500 text-custom-500 size-4 stroke-1"
          icon="uil:check"
        />
      )}
    </button>
  )
}

export default TaskCompletionCheckbox
