import { useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import { Checkbox } from 'lifeforge-ui'
import { toast } from 'react-toastify'

import {
  type TodoListEntry,
  useTodoListContext
} from '@apps/TodoList/providers/TodoListProvider'

import TaskDueDate from './components/TaskDueDate'
import TaskHeader from './components/TaskHeader'
import TaskTags from './components/TaskTags'

function TaskItem({
  entry,
  lighter,
  isInDashboardWidget
}: {
  entry: TodoListEntry
  lighter?: boolean
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()

  const {
    statusCounterQuery,
    listsQuery,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  const lists = listsQuery.data ?? []

  async function toggleTaskCompletion() {
    try {
      await forgeAPI.todoList.entries.toggleEntry
        .input({
          id: entry.id
        })
        .mutate({})

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['todoList'] })
        statusCounterQuery.refetch()
      }, 500)
    } catch {
      toast.error('Error toggling task completion')
    }
  }

  return (
    <li
      key={entry.id}
      className={clsx(
        'flex-between shadow-custom relative isolate flex gap-6 rounded-lg p-4 transition-all',
        lighter ? 'component-bg-lighter' : 'component-bg-with-hover'
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        {typeof lists !== 'string' && entry.list !== '' && (
          <span
            className="h-10 w-1 shrink-0 rounded-full"
            style={{
              backgroundColor: lists.find(l => l.id === entry.list)?.color
            }}
          />
        )}
        <div className="w-full min-w-0">
          <TaskHeader entry={entry} />
          {(entry.due_date || entry.tags.length > 0) && (
            <div className="mt-1 flex items-center gap-2">
              <TaskDueDate entry={entry} />
              <TaskTags entry={entry} />
            </div>
          )}
        </div>
      </div>
      <Checkbox
        checked={entry.done}
        onCheckedChange={() => {
          toggleTaskCompletion()
        }}
      />
      <button
        className="absolute top-0 left-0 size-full"
        onClick={() => {
          if (!isInDashboardWidget) {
            setModifyTaskWindowOpenType('update')
            setSelectedTask(entry)
          }
        }}
      />
    </li>
  )
}

export default TaskItem
