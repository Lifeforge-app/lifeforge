/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import Button from '@components/ButtonsAndInputs/Button'
import { useTodoListContext } from '@providers/TodoListProvider'

function Header({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { t } = useTranslation()
  const {
    entries,
    priorities,
    lists,
    tags,
    setSelectedTask,
    setModifyTaskWindowOpenType
  } = useTodoListContext()
  const [searchParams, setSearchParams] = useSearchParams()

  if (
    typeof entries === 'string' ||
    typeof lists === 'string' ||
    typeof tags === 'string' ||
    typeof priorities === 'string'
  ) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex-between flex">
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold md:text-4xl">
          {`${t(
            `todoList.header.${(() => {
              const status = searchParams.get('status')
              const hasFilter =
                searchParams.has('list') || searchParams.has('tag')
              if (status === null || status === '') {
                return hasFilter ? 'filtered' : 'all'
              }
              return status === 'today' ? 'todays' : status
            })().toLowerCase()}Tasks`
          )} ${
            searchParams.has('priority')
              ? `(${
                  priorities.find(
                    priority => priority.id === searchParams.get('priority')
                  )?.name
                })`
              : ''
          }`.trim()}{' '}
          <span className="text-base text-bg-500">({entries.length})</span>
        </h1>
        {(Boolean(searchParams.get('list')) ||
          Boolean(searchParams.get('tag')) ||
          Boolean(searchParams.get('priority'))) && (
          <div className="flex flex-wrap items-center gap-2">
            {Boolean(searchParams.get('priority')) && (
              <span className="flex-center flex gap-1 rounded-full bg-custom-500/20 px-2 py-1 text-sm text-custom-500">
                <Icon icon="tabler:sort-ascending-numbers" className="size-4" />
                {
                  priorities.find(
                    priority => priority.id === searchParams.get('priority')
                  )?.name
                }
                <button
                  onClick={() => {
                    setSearchParams(searchParams => {
                      searchParams.delete('priority')
                      return searchParams
                    })
                  }}
                >
                  <Icon icon="tabler:x" className="size-4" />
                </button>
              </span>
            )}
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
                {tags.find(tag => tag.id === searchParams.get('tag'))?.name}
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
        )}
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
          className="-ml-4 rounded-lg p-4 text-bg-500 transition-all hover:bg-bg-200 dark:hover:bg-bg-800 dark:hover:text-bg-50 lg:hidden"
        >
          <Icon icon="tabler:menu" className="text-2xl" />
        </button>
      </div>
    </div>
  )
}

export default Header
