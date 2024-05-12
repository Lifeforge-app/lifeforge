import { Icon } from '@iconify/react'
import React, { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import { type ITodoListList } from '@typedec/TodoList'

function TaskTagList({
  setSidebarOpen,
  setModifyTagModalOpenType,
  setExistedSidebarData
}: {
  setSidebarOpen: (value: boolean) => void
  setModifyTagModalOpenType: (value: 'create' | 'update' | null) => void
  setExistedSidebarData: (value: ITodoListList | null) => void
}): React.ReactElement {
  const { tags } = useContext(TodoListContext)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle
        name="Tags"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyTagModalOpenType('create')
          setExistedSidebarData(null)
        }}
      />
      <APIComponentWithFallback data={tags}>
        {typeof tags !== 'string' && (
          <>
            {tags.map(({ id, name, amount }) => (
              <li
                key={id}
                className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
                  searchParams.get('tag') === id
                    ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
                    : 'text-bg-500 dark:text-bg-500'
                }`}
              >
                <div
                  role="button"
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      tag: id
                    })
                    setSidebarOpen(false)
                  }}
                  className="group flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-800"
                >
                  <Icon icon="tabler:hash" className="h-5 w-5 shrink-0" />
                  <p className="w-full truncate">{name}</p>
                  <span
                    className={`text-sm ${
                      searchParams.get('tag') === id && 'group-hover:hidden'
                    }`}
                  >
                    {amount}
                  </span>
                  {searchParams.get('tag') === id && (
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setSearchParams(searchParams => {
                          searchParams.delete('tag')
                          return searchParams
                        })
                        setSidebarOpen(false)
                      }}
                      className="hidden overscroll-contain group-hover:block"
                    >
                      <Icon icon="tabler:x" className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </>
        )}
      </APIComponentWithFallback>
    </>
  )
}

export default TaskTagList
