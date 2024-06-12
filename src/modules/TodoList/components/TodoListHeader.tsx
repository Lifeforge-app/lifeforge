import { Icon } from '@iconify/react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import { type ITodoListTag } from '@interfaces/todo_list_interfaces'
import { useTodoListContext } from '@providers/TodoListProvider'

function TodoListHeader({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { entries, lists, tags, setSelectedTask, setModifyTaskWindowOpenType } =
    useTodoListContext()
  const [searchParams, setSearchParams] = useSearchParams()

  if (typeof entries === 'string' || typeof lists === 'string') return <></>

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-semibold  md:text-4xl">
          {(() => {
            const status = searchParams.get('status')
            if (status === null || status === '') return 'All'
            return status.charAt(0).toUpperCase() + status.slice(1)
          })()}{' '}
          Tasks{' '}
          <span className="text-base text-bg-500">({entries.length})</span>
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {Boolean(searchParams.get('list')) && (
            <span className="flex-center flex gap-1 rounded-full bg-custom-500/20 px-2 py-1 text-sm text-custom-500">
              <Icon icon="tabler:list" className="size-4" />
              {lists.find(list => list.id === searchParams.get('list'))?.name}
              <button
                onClick={() => {
                  setSearchParams(searchParams => {
                    searchParams.delete('list')
                    return searchParams
                  })
                }}
              >
                <Icon icon="tabler:x" className="size-4" />
              </button>
            </span>
          )}
          {Boolean(searchParams.get('tag')) && (
            <span className="flex-center flex gap-1 rounded-full bg-custom-500/20 px-2 py-1 text-sm text-custom-500">
              <Icon icon="tabler:hash" className="size-4" />
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
                <Icon icon="tabler:x" className="size-4" />
              </button>
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <Button
          onClick={() => {
            setSelectedTask(null)
            setModifyTaskWindowOpenType('create')
          }}
          className="hidden sm:flex"
          icon="tabler:plus"
        >
          new task
        </Button>
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
  )
}

export default TodoListHeader
