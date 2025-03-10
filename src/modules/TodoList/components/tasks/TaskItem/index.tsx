import clsx from 'clsx'
import React from 'react'
import useThemeColors from '@hooks/useThemeColor'
import { type Loadable } from '@interfaces/common'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import fetchAPI from '@utils/fetchAPI'
import SubtaskItem from './components/SubtaskItem'
import TaskCompletionCheckbox from './components/TaskCompletionCheckbox'
import TaskDueDate from './components/TaskDueDate'
import TaskHeader from './components/TaskHeader'
import TaskTags from './components/TaskTags'

function TaskItem({
  entry,
  lighter,
  isOuter,
  entries,
  setEntries,
  refreshEntries
}: {
  entry: ITodoListEntry
  lighter?: boolean
  isOuter?: boolean
  entries?: ITodoListEntry[]
  setEntries?: React.Dispatch<React.SetStateAction<Loadable<ITodoListEntry[]>>>
  refreshEntries?: () => void
}): React.ReactElement {
  const { componentBgWithHover } = useThemeColors()
  const {
    entries: innerEntries,
    lists,
    setEntries: setInnerEntries,
    refreshEntries: refreshInnerEntries,
    refreshStatusCounter,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  async function toggleTaskCompletion(): Promise<void> {
    if (typeof innerEntries === 'string') return

    if (!isOuter) {
      setInnerEntries(
        innerEntries.map(e =>
          e.id === entry.id
            ? {
                ...e,
                done: !e.done
              }
            : e
        )
      )
    } else {
      if (entries && setEntries) {
        setEntries(
          entries.map(e =>
            e.id === entry.id
              ? {
                  ...e,
                  done: !e.done
                }
              : e
          )
        )
      }
    }

    try {
      await fetchAPI(`todo-list/entries/toggle/${entry.id}`, {
        method: 'POST'
      })

      setTimeout(() => {
        if (!isOuter) {
          refreshInnerEntries()
        } else {
          if (refreshEntries) {
            refreshEntries()
          }
        }
        refreshStatusCounter()
      }, 500)
    } catch {
      if (!isOuter) {
        refreshInnerEntries()
      } else {
        if (refreshEntries) {
          refreshEntries()
        }
      }
    }
  }

  return (
    <>
      <li
        key={entry.id}
        className={clsx(
          'flex-between shadow-custom relative isolate flex gap-4 rounded-lg p-4 pr-6 pl-5 transition-all',
          lighter ? 'bg-bg-100/50 dark:bg-bg-800' : componentBgWithHover
        )}
      >
        <div className="flex items-center gap-4">
          {typeof lists !== 'string' && entry.list !== '' && (
            <span
              className="h-10 w-1 shrink-0 rounded-full"
              style={{
                backgroundColor: lists.find(l => l.id === entry.list)?.color
              }}
            />
          )}
          <div>
            <TaskHeader entry={entry} />
            {(entry.due_date || entry.tags.length > 0) && (
              <div className="mt-1 flex items-center gap-2">
                <TaskDueDate entry={entry} />
                <TaskTags entry={entry} />
              </div>
            )}
          </div>
        </div>
        <button
          className="absolute top-0 left-0 size-full"
          onClick={() => {
            if (!isOuter) {
              setModifyTaskWindowOpenType('update')
              setSelectedTask(entry)
            }
          }}
        />
        <TaskCompletionCheckbox
          entry={entry}
          toggleTaskCompletion={() => {
            toggleTaskCompletion().catch(console.error)
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
