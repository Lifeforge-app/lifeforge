/* eslint-disable @typescript-eslint/indent */
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
import TaskItem from './components/TaskItem'
import { toast } from 'react-toastify'
import ModifyTaskWindow from './components/ModifyTaskWindow'

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
  const [tagsList, refreshTagsList] =
    useFetch<ITodoListTag[]>('todo-list/tag/list')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entry/list'
  )
  const [isModifyTaskWindowOpen, setIsModifyTaskWindowOpen] = useState(false)

  function toggleTaskCompletion(id: string): void {
    if (typeof entries === 'string') return

    setEntries(
      entries.map(entry => {
        if (entry.id === id) {
          return { ...entry, done: !entry.done }
        }
        return entry
      })
    )

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
      })
      .catch(err => {
        toast.error("Oops! Couldn't update the task. Please try again.")
        refreshEntries()
        console.error(err)
      })
  }

  return (
    <>
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
            refreshTagsList={refreshTagsList}
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
                className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
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
                  entries.map(entry => (
                    <TaskItem
                      entry={entry}
                      lists={lists}
                      tagsList={tagsList}
                      toggleTaskCompletion={toggleTaskCompletion}
                      setIsModifyTaskWindowOpen={setIsModifyTaskWindowOpen}
                      key={entry.id}
                    />
                  ))}
              </APIComponentWithFallback>
            </ul>
          </div>
        </div>
      </section>
      <ModifyTaskWindow
        isOpen={isModifyTaskWindowOpen}
        setIsOpen={setIsModifyTaskWindowOpen}
        lists={lists as unknown as ITodoListList[]}
        tagsList={tagsList}
      />
    </>
  )
}

export default TodoList
