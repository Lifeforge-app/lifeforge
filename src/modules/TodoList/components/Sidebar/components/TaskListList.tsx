import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import { type ITodoListList } from '@typedec/TodoList'

function TaskListList({
  setSidebarOpen,
  setModifyListModalOpenType,
  setExistedSidebarData
}: {
  setSidebarOpen: (value: boolean) => void
  setModifyListModalOpenType: (value: 'create' | 'update' | null) => void
  setExistedSidebarData: (value: ITodoListList | null) => void
}): React.ReactElement {
  const { lists } = useContext(TodoListContext)
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <>
      <SidebarTitle
        name="lists"
        actionButtonIcon="tabler:plus"
        actionButtonOnClick={() => {
          setModifyListModalOpenType('create')
          setExistedSidebarData(null)
        }}
      />
      <APIComponentWithFallback data={lists}>
        {typeof lists !== 'string' && (
          <>
            {lists.map(({ icon, name, color, id, amount }) => (
              <li
                key={id}
                className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
                  searchParams.get('list') === id
                    ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
                    : 'text-bg-500 dark:text-bg-500'
                }`}
              >
                <div
                  role="button"
                  onClick={() => {
                    setSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      list: id
                    })
                    setSidebarOpen(false)
                  }}
                  className="group flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 text-left hover:bg-bg-200/50 dark:hover:bg-bg-800"
                >
                  <span
                    className="block h-8 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: color
                    }}
                  />
                  <Icon icon={icon} className="h-6 w-6 shrink-0" />
                  <div className="w-full truncate">{name}</div>
                  <span
                    className={`text-sm ${
                      searchParams.get('list') === id && 'group-hover:hidden'
                    }`}
                  >
                    {amount}
                  </span>
                  {searchParams.get('list') === id && (
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setSearchParams(searchParams => {
                          searchParams.delete('list')
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

export default TaskListList
