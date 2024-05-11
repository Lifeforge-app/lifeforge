/* eslint-disable multiline-ternary */
import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useContext, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import DeleteConfirmationModal from '@components/DeleteConfirmationModal'
import EmptyStateScreen from '@components/EmptyStateScreen'
import SearchInput from '@components/SearchInput'
import { TodoListContext } from '@providers/TodoListProvider'
import { type ITodoListList, type ITodoListTag } from '@typedec/TodoList'
import ModifyTaskWindow from './ModifyTaskWindow'
import Sidebar from './Sidebar'
import TaskList from './TaskList'

function TodoListContainer(): React.ReactElement {
  const {
    entries,
    tags,
    lists,
    refreshLists,
    refreshTagsList,
    refreshEntries,
    refreshStatusCounter,
    setModifyTaskWindowOpenType,
    deleteTaskConfirmationModalOpen,
    setDeleteTaskConfirmationModalOpen,
    selectedTask,
    setSelectedTask
  } = useContext(TodoListContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <div className="mt-6 flex min-h-0 w-full flex-1">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex h-full flex-1 flex-col lg:ml-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-bg-800 dark:text-bg-100 md:text-4xl">
                {(() => {
                  const status = searchParams.get('status')
                  if (status === null || status === '') return 'All'
                  return status.charAt(0).toUpperCase() + status.slice(1)
                })()}{' '}
                Tasks{' '}
                <span className="text-base text-bg-500">
                  ({entries.length})
                </span>
              </h1>
              <div className="mt-2 flex items-center gap-2">
                {searchParams.get('list') && (
                  <span className="flex items-center justify-center gap-1 rounded-full bg-custom-500/20 px-2 py-1 text-sm text-custom-500">
                    <Icon icon="tabler:list" className="h-4 w-4" />
                    {
                      (lists as ITodoListList[]).find(
                        list => list.id === searchParams.get('list')
                      )?.name
                    }
                    <button
                      onClick={() => {
                        setSearchParams(searchParams => {
                          searchParams.delete('list')
                          return searchParams
                        })
                      }}
                    >
                      <Icon icon="tabler:x" className="h-4 w-4" />
                    </button>
                  </span>
                )}
                {searchParams.get('tag') && (
                  <span className="flex items-center justify-center gap-1 rounded-full bg-custom-500/20 px-2 py-1 text-sm text-custom-500">
                    <Icon icon="tabler:hash" className="h-4 w-4" />
                    {
                      (tags as ITodoListTag[]).find(
                        tag => tag.id === searchParams.get('tag')
                      )?.name
                    }
                    <button
                      onClick={() => {
                        setSearchParams(searchParams => {
                          searchParams.delete('tag')
                          return searchParams
                        })
                      }}
                    >
                      <Icon icon="tabler:x" className="h-4 w-4" />
                    </button>
                  </span>
                )}
              </div>
            </div>
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
            {typeof entries !== 'string' && entries.length > 0 ? (
              <TaskList />
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
      <ModifyTaskWindow />
      <DeleteConfirmationModal
        apiEndpoint="todo-list/entry/delete"
        isOpen={deleteTaskConfirmationModalOpen}
        closeModal={() => {
          setDeleteTaskConfirmationModalOpen(false)
          refreshLists()
          refreshTagsList()
          refreshStatusCounter()
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

export default TodoListContainer
