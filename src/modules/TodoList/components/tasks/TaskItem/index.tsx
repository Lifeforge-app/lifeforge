/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { cookieParse } from 'pocketbase'
import React from 'react'
import { toast } from 'react-toastify'
import { useTodoListContext } from '@providers/TodoListProvider'
import { type ITodoListEntry } from '@typedec/TodoList'
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
  setEntries?: React.Dispatch<
    React.SetStateAction<ITodoListEntry[] | 'loading' | 'error'>
  >
  refreshEntries?: () => void
}): React.ReactElement {
  const {
    entries: innerEntries,
    lists,
    setEntries: setInnerEntries,
    refreshEntries: refreshInnerEntries,
    refreshStatusCounter,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()

  function toggleTaskCompletion(id: string): void {
    if (typeof innerEntries === 'string') return

    if (!isOuter) {
      setInnerEntries(
        innerEntries.map(e =>
          e.id === id
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
            e.id === id
              ? {
                  ...e,
                  done: !e.done
                }
              : e
          )
        )
      }
    }

    fetch(`${import.meta.env.VITE_API_HOST}/todo-list/entry/toggle/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookieParse(document.cookie).token}`
      }
    })
      .then(async res => {
        try {
          const data = await res.json()

          if (!res.ok || data.state !== 'success') {
            throw new Error(data.message)
          }

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
        } catch (err) {
          throw new Error(err as string)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the task. Please try again.")
        if (!isOuter) {
          refreshInnerEntries()
        } else {
          if (refreshEntries) {
            refreshEntries()
          }
        }
        console.error(err)
      })
  }

  return (
    <li
      key={entry.id}
      className={`relative isolate flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-4 pl-5 pr-6 shadow-custom ${
        lighter ? 'dark:bg-bg-800' : 'dark:bg-bg-900'
      }`}
    >
      <div className="flex items-center gap-4">
        {typeof lists !== 'string' && entry.list !== null && (
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
        onClick={() => {
          setModifyTaskWindowOpenType('update')
          setSelectedTask(entry)
        }}
        className="absolute left-0 top-0 h-full w-full"
      />
      <TaskCompletionCheckbox
        entry={entry}
        toggleTaskCompletion={toggleTaskCompletion}
      />
    </li>
  )
}

export default TaskItem
