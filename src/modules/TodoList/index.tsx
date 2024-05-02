/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/naming-convention */
import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import ModuleHeader from '@components/ModuleHeader'
import ModuleWrapper from '@components/ModuleWrapper'
import SearchInput from '@components/SearchInput'
import useFetch from '@hooks/useFetch'
import ModifyTaskWindow from './components/ModifyTaskWindow'
import Sidebar from './components/Sidebar'
import TaskList from './components/TaskList'
import {
  type ITodoListList,
  type ITodoListTag,
  type ITodoListEntry,
  type ITodoListEntryItem
} from '../../types/TodoList'

function TodoList(): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [lists, refreshLists] = useFetch<ITodoListList[]>('todo-list/list/list')
  const [tagsList, refreshTagsList] =
    useFetch<ITodoListTag[]>('todo-list/tag/list')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry>(
    'todo-list/entry/list'
  )
  const [modifyTaskWindowOpenType, setModifyTaskWindowOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [deleteTaskConfirmationModalOpen, setDeleteTaskConfirmationModalOpen] =
    useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTask, setSelectedTask] = useState<ITodoListEntryItem | null>(
    null
  )

  return (
    <>
      <ModuleWrapper>
        <ModuleHeader
          title="Todo List"
          desc="Human brain is not designed to remember everything."
        />
        <div className="mt-6 flex min-h-0 w-full flex-1">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            lists={lists}
            refreshLists={refreshLists}
            tags={tagsList}
            refreshTagsList={refreshTagsList}
          />
          <div className="flex h-full flex-1 flex-col lg:ml-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
                All Tasks <span className="text-base text-bg-500">(10)</span>
              </h1>
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setSelectedTask(null)
                    setModifyTaskWindowOpenType('create')
                  }}
                  className="hidden items-center gap-2 rounded-lg bg-custom-500 p-4 pr-5 font-semibold uppercase tracking-wider text-bg-100 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] transition-all hover:bg-custom-600 dark:text-bg-800 sm:flex"
                >
                  <Icon icon="tabler:plus" className="text-xl" />
                  new task
                </button>
                <button
                  onClick={() => {
                    setSidebarOpen(true)
                  }}
                  className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-100 lg:hidden"
                >
                  <Icon icon="tabler:menu" className="text-2xl" />
                </button>
              </div>
            </div>
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              stuffToSearch="tasks"
            />
            <APIComponentWithFallback data={entries}>
              {typeof entries !== 'string' &&
              (entries.pending.length > 0 || entries.done.length > 0) ? (
                <TaskList
                  entries={entries}
                  lists={lists}
                  tagsList={tagsList}
                  setEntries={setEntries}
                  refreshEntries={refreshEntries}
                  setModifyTaskWindowOpenType={setModifyTaskWindowOpenType}
                  setSelectedTask={setSelectedTask}
                />
              ) : (
                <EmptyStateScreen
                  title="No tasks found"
                  description="You can create a new task by clicking the button below."
                  icon="tabler:article-off"
                  ctaContent="Create a new task"
                  setModifyModalOpenType={setModifyTaskWindowOpenType}
                />
              )}
            </APIComponentWithFallback>
          </div>
        </div>
      </ModuleWrapper>
      <ModifyTaskWindow
        openType={modifyTaskWindowOpenType}
        setOpenType={setModifyTaskWindowOpenType}
        lists={lists as unknown as ITodoListList[]}
        tagsList={tagsList as unknown as ITodoListTag[]}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        refreshEntries={refreshEntries}
        refreshTagsList={refreshTagsList}
        refreshLists={refreshLists}
        setDeleteTaskConfirmationModalOpen={setDeleteTaskConfirmationModalOpen}
      />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/entry/delete"
        isOpen={deleteTaskConfirmationModalOpen}
        closeModal={() => {
          setDeleteTaskConfirmationModalOpen(false)
        }}
        data={selectedTask}
        itemName="task"
        updateDataList={refreshEntries}
        nameKey="summary"
      />
      <button
        onClick={() => {
          setSelectedTask(null)
          setModifyTaskWindowOpenType('create')
        }}
        className="absolute bottom-6 right-6 z-10 flex items-center gap-2 rounded-lg bg-custom-500 p-4 font-semibold uppercase tracking-wider text-bg-100 shadow-lg hover:bg-custom-600 dark:text-bg-800 sm:hidden"
      >
        <Icon icon="tabler:plus" className="h-6 w-6 shrink-0 transition-all" />
      </button>
    </>
  )
}

export default TodoList
