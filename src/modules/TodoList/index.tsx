/* eslint-disable @typescript-eslint/naming-convention */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import Sidebar, {
  type ITodoListTag,
  type ITodoListList
} from './components/Sidebar'
import ModuleHeader from '../../components/general/ModuleHeader'
import useFetch from '../../hooks/useFetch'
import APIComponentWithFallback from '../../components/general/APIComponentWithFallback'
import moment from 'moment'
import { toast } from 'react-toastify'

export interface ITodoListEntry {
  collectionId: string
  collectionName: string
  created: string
  due_date: string
  id: string
  list: string
  notes: string
  priority: string
  summary: string
  tags: string[]
  updated: string
  done: boolean
}

function TodoList(): React.JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lists, refreshLists] = useFetch<ITodoListList[]>('todo-list/list/list')
  const [tagsList] = useFetch<ITodoListTag[]>('todo-list/tag/list')
  const [entries, refreshEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entry/list'
  )

  function toggleTaskCompletion(id: string): void {
    fetch(`${import.meta.env.VITE_API_HOST}/todo-list/entry/toggle/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        const data = await res.json()

        if (data.state !== 'success') {
          throw new Error(data.message)
        }

        refreshEntries()
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the task. Please try again.")
        console.error(err)
      })
  }

  return (
    <section className="flex h-full min-h-0 w-full flex-1 flex-col px-8 sm:px-12">
      <ModuleHeader
        title="Todo List"
        desc="Human brain is not designed to remember everything."
      />
      <div className="mb-12 mt-8 flex min-h-0 w-full flex-1">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          lists={lists}
          refreshLists={refreshLists}
          tags={tagsList}
        />
        <div className="h-full flex-1 lg:ml-12">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
              All Tasks <span className="text-base text-bg-400">(10)</span>
            </h1>
            <button
              onClick={() => {
                setSidebarOpen(true)
              }}
              className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100"
            >
              <Icon icon="tabler:menu" className="text-2xl" />
            </button>
          </div>
          <search className="my-8 flex w-full items-center gap-4 rounded-lg bg-bg-50 p-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900">
            <Icon icon="tabler:search" className="h-5 w-5 text-bg-500" />
            <input
              type="text"
              placeholder="Search projects ..."
              className="w-full bg-transparent text-bg-500 placeholder:text-bg-400 focus:outline-none"
            />
          </search>
          <ul className="mt-6 flex flex-col gap-4">
            <li className="flex items-center justify-center">
              <button className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-bg-400 p-6 font-semibold uppercase tracking-widest text-bg-400 hover:bg-bg-200 dark:border-bg-700 dark:text-bg-700 dark:hover:bg-bg-800/30">
                <Icon icon="tabler:plus" className="text-2xl" />
                <span className="ml-1">Add New Task</span>
              </button>
            </li>
            <APIComponentWithFallback data={entries}>
              {typeof entries !== 'string' &&
                entries.map(
                  ({ id, summary, list, tags, due_date, priority, done }) => (
                    <li
                      key={id}
                      className="flex items-center justify-between gap-4 rounded-lg bg-bg-50 p-4 pl-5 pr-6 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] dark:bg-bg-900"
                    >
                      <div className="flex items-center gap-4">
                        {typeof lists !== 'string' && list !== null && (
                          <span
                            className="h-10 w-1 shrink-0 rounded-full"
                            style={{
                              backgroundColor: lists.find(l => l.id === list)
                                ?.color
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
                                }[priority]
                              }
                        `}
                            >
                              {'!'.repeat(
                                ['low', 'medium', 'high'].indexOf(priority) + 1
                              )}
                            </span>
                            {summary}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-bg-500">
                              {moment(due_date).fromNow()}
                            </div>
                            <div className="flex items-center">
                              {typeof tagsList !== 'string' &&
                                tags.length > 0 &&
                                tags.map(tag => (
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
                          toggleTaskCompletion(id)
                        }}
                        className={`flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-offset-4 ring-offset-bg-900 transition-all hover:border-custom-500 ${
                          done
                            ? 'bg-custom-500 ring-custom-500'
                            : 'bg-bg-900 ring-bg-500'
                        }`}
                      />
                    </li>
                  )
                )}
            </APIComponentWithFallback>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default TodoList
