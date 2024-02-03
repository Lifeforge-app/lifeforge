/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { type ITodoListEntry } from '..'
import { type ITodoListTag, type ITodoListList } from './Sidebar'
import moment from 'moment'
import { Icon } from '@iconify/react/dist/iconify.js'

function TaskItem({
  entry,
  lists,
  tagsList,
  toggleTaskCompletion,
  setIsModifyTaskWindowOpen
}: {
  entry: ITodoListEntry
  lists: ITodoListList[] | 'loading' | 'error'
  tagsList: ITodoListTag[] | 'loading' | 'error'
  toggleTaskCompletion: (id: string) => void
  setIsModifyTaskWindowOpen: React.Dispatch<React.SetStateAction<boolean>>
}): React.ReactElement {
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
        <div className="flex flex-col gap-1">
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
          <div className="flex items-center gap-2">
            <div className="text-sm text-bg-500">
              {moment(entry.due_date).fromNow()}
            </div>
            <div className="flex items-center">
              {typeof tagsList !== 'string' &&
                entry.tags.length > 0 &&
                entry.tags.map(tag => (
                  <span
                    key={tag}
                    className="relative isolate px-2 py-0.5 text-xs text-custom-500"
                  >
                    <div className="absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-custom-500 opacity-20" />
                    #{tagsList.find(t => t.id === tag)?.name}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          setIsModifyTaskWindowOpen(true)
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
