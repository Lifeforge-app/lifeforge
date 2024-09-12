/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIRequest from '@utils/fetchData'
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

    await APIRequest({
      endpoint: `todo-list/entries/toggle/${entry.id}`,
      method: 'POST',
      failureInfo: 'update',
      onFailure: () => {
        if (!isOuter) {
          refreshInnerEntries()
        } else {
          if (refreshEntries) {
            refreshEntries()
          }
        }
      },
      callback: () => {
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
      }
    })
  }

  return (
    <>
      <li
        key={entry.id}
        className={`flex-between relative isolate flex gap-4 rounded-lg bg-bg-50 p-4 pl-5 pr-6 shadow-custom transition-all hover:bg-bg-100 dark:hover:bg-bg-800/70 ${
          lighter ? 'dark:bg-bg-800' : 'dark:bg-bg-900'
        }`}
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
          onClick={() => {
            setModifyTaskWindowOpenType('update')
            setSelectedTask(entry)
          }}
          className="absolute left-0 top-0 size-full"
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
            <SubtaskItem entry={subtask} parentId={entry.id} key={subtask.id} />
          ))}
        </ul>
      )}
    </>
  )
}

export default TaskItem
