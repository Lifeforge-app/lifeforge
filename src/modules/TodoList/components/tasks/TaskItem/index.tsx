import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'

import { Checkbox } from '@lifeforge/ui'

import { useTodoListContext } from '@modules/TodoList/providers/TodoListProvider'

import useComponentBg from '@hooks/useComponentBg'

import fetchAPI from '@utils/fetchAPI'

import { type ITodoListEntry } from '../../../interfaces/todo_list_interfaces'
import SubtaskItem from './components/SubtaskItem'
import TaskDueDate from './components/TaskDueDate'
import TaskHeader from './components/TaskHeader'
import TaskTags from './components/TaskTags'

function TaskItem({
  entry,
  lighter,
  isInDashboardWidget
}: {
  entry: ITodoListEntry
  lighter?: boolean
  isInDashboardWidget?: boolean
}) {
  const queryClient = useQueryClient()
  const { componentBgWithHover } = useComponentBg()
  const {
    entriesQueryKey,
    entries: innerEntries,
    lists,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  async function toggleTaskCompletion() {
    if (typeof innerEntries === 'string') return

    queryClient.setQueryData<ITodoListEntry[]>(
      entriesQueryKey,
      innerEntries.map(e =>
        e.id === entry.id
          ? {
              ...e,
              done: !e.done
            }
          : e
      )
    )

    try {
      await fetchAPI(`todo-list/entries/toggle/${entry.id}`, {
        method: 'POST'
      })

      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: entriesQueryKey })

        queryClient.invalidateQueries({
          queryKey: ['todo-list', 'status-counter']
        })
      }, 500)
    } catch {
      queryClient.invalidateQueries({ queryKey: entriesQueryKey })
    }
  }

  return (
    <>
      <li
        key={entry.id}
        className={clsx(
          'flex-between shadow-custom relative isolate flex gap-4 rounded-lg p-4 pl-5 pr-6 transition-all',
          lighter ? 'bg-bg-100/50 dark:bg-bg-800' : componentBgWithHover
        )}
      >
        <div className="flex items-center w-full min-w-0 gap-4">
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
          onChange={() => {
            toggleTaskCompletion()
          }}
        />
        <button
          className="absolute left-0 top-0 size-full"
          onClick={() => {
            if (!isInDashboardWidget) {
              setModifyTaskWindowOpenType('update')
              setSelectedTask(entry)
            }
          }}
        />
      </li>
      {entry.subtasks.length > 0 && (
        <ul className="space-y-4 pl-4">
          {entry.subtasks.map(subtask => (
            <SubtaskItem key={subtask.id} entry={subtask} parentId={entry.id} />
          ))}
        </ul>
      )}
    </>
  )
}

export default TaskItem
