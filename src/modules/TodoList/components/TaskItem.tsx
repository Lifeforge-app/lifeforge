/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import moment from 'moment'
import { cookieParse } from 'pocketbase'
import React, { useContext } from 'react'
import { toast } from 'react-toastify'
import { TodoListContext } from '@providers/TodoListProvider'
import { type ITodoListEntry } from '../../../types/TodoList'

function TaskItem({ entry }: { entry: ITodoListEntry }): React.ReactElement {
  const {
    entries,
    lists,
    tags,
    setEntries,
    refreshEntries,
    refreshStatusCounter,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useContext(TodoListContext)

  function toggleTaskCompletion(id: string): void {
    if (typeof entries === 'string') return

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
            refreshEntries()
            refreshStatusCounter()
          }, 500)
        } catch (err) {
          throw new Error(err as string)
        }
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the task. Please try again.")
        refreshEntries()
        console.error(err)
      })
  }

  return (
    <li
      key={entry.id}
      className="relative isolate flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-4 pl-5 pr-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
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
          <div className="font-semibold text-bg-800 dark:text-bg-100">
            <span
              className={`mr-2 font-semibold tracking-widest ${
                {
                  low: 'text-emerald-500',
                  medium: 'text-yellow-500',
                  high: 'text-red-500'
                }[entry.priority]
              }
                        `}
            >
              {'!'.repeat(
                ['low', 'medium', 'high'].indexOf(entry.priority) + 1
              )}
            </span>
            {entry.summary}
          </div>
          {(entry.due_date || entry.tags.length > 0) && (
            <div className="mt-1 flex items-center gap-2">
              {entry.done && entry.completed_at ? (
                <div className="text-sm text-bg-500">
                  Completed: {moment(entry.completed_at).fromNow()}
                </div>
              ) : (
                entry.due_date && (
                  <div
                    className={`text-sm ${
                      moment(entry.due_date).isBefore(moment())
                        ? 'text-red-500'
                        : 'text-bg-500'
                    }`}
                  >
                    Due {moment(entry.due_date).fromNow()}
                  </div>
                )
              )}
              <div className="flex items-center gap-1">
                {typeof tags !== 'string' &&
                  entry.tags?.length > 0 &&
                  entry.tags.map(tag => (
                    <span
                      key={tag}
                      className="relative isolate px-2 py-0.5 text-xs text-custom-500"
                    >
                      <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-custom-500 opacity-20" />
                      #{tags.find(t => t.id === tag)?.name}
                    </span>
                  ))}
              </div>
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
      <button
        onClick={() => {
          toggleTaskCompletion(entry.id)
        }}
        className={`relative z-50 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-bg-50 transition-all hover:border-custom-500 dark:ring-offset-bg-900 ${
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
    </li>
  )
}

export default TaskItem
