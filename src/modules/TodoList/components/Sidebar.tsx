/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import GoBackButton from '@components/GoBackButton'
import { TodoListContext } from '@providers/TodoListProvider'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import { type ITodoListList } from '@typedec/TodoList'
import ModifyListModal from './ModifyListModal'
import ModifyTagModal from './ModifyTagModal'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { statusCounter, lists, tags, refreshLists, refreshTagsList } =
    useContext(TodoListContext)
  const [modifyListModalOpenType, setModifyListModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [modifyTagModalOpenType, setModifyTagModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedListData, setExistedListData] = useState<ITodoListList | null>(
    null
  )
  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({
    x: 0,
    y: 0
  })
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const handleClick = (): void => {
      setContextMenuOpen(false)
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <>
      <aside
        className={`absolute ${
          sidebarOpen ? 'left-0' : 'left-full'
        } top-0 z-[9999] h-full w-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-3rem)] lg:w-4/12 xl:w-1/4`}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
          <SidebarTitle name="tasks" />
          <APIComponentWithFallback data={statusCounter}>
            {typeof statusCounter !== 'string' &&
              [
                ['tabler:article', 'All'],
                ['tabler:calendar-exclamation', 'Today'],
                ['tabler:calendar-up', 'Scheduled'],
                ['tabler:calendar-x', 'Overdue'],
                ['tabler:calendar-check', 'Completed']
              ].map(([icon, name], index) => (
                <li
                  key={index}
                  className={`relative flex items-center gap-6 px-4 font-medium transition-all ${
                    searchParams.get('status') === name.toLowerCase() ||
                    (name === 'All' && !searchParams.get('status'))
                      ? "text-bg-800 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-1 after:-translate-y-1/2 after:rounded-full after:bg-custom-500 after:content-[''] dark:text-bg-100"
                      : 'text-bg-500 dark:text-bg-500'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (name === 'All') {
                        setSearchParams(searchParams => {
                          searchParams.delete('status')
                          return searchParams
                        })
                        return
                      }
                      setSearchParams({
                        ...Object.fromEntries(searchParams.entries()),
                        status: name.toLowerCase()
                      })
                    }}
                    className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800"
                  >
                    <Icon icon={icon} className="h-6 w-6 shrink-0" />
                    <div className="flex w-full items-center justify-between">
                      {name}
                    </div>
                    <span className="text-sm">
                      {
                        statusCounter[
                          name.toLowerCase() as keyof typeof statusCounter
                        ]
                      }
                    </span>
                  </button>
                </li>
              ))}
          </APIComponentWithFallback>
          <SidebarDivider />
          <SidebarTitle
            name="lists"
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setModifyListModalOpenType('create')
              setExistedListData(null)
            }}
          />
          <APIComponentWithFallback data={lists}>
            {typeof lists !== 'string' && (
              <>
                {lists.map(({ icon, name, color, id, amount }) => (
                  <li
                    key={id}
                    onContextMenu={e => {
                      e.preventDefault()
                      setContextMenuOpen(true)
                      setContextMenuPosition({
                        x: e.pageX,
                        y: e.pageY
                      })
                    }}
                    onContextMenuCapture={() => {
                      setContextMenuOpen(false)
                    }}
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
                          searchParams.get('list') === id &&
                          'group-hover:hidden'
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
          <SidebarDivider />
          <SidebarTitle
            name="Tags"
            actionButtonIcon="tabler:plus"
            actionButtonOnClick={() => {
              setModifyTagModalOpenType('create')
              setExistedListData(null)
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
        </ul>
      </aside>
      <ModifyListModal
        openType={modifyListModalOpenType}
        setOpenType={setModifyListModalOpenType}
        updateListsList={refreshLists}
        existedData={existedListData}
      />
      <ModifyTagModal
        openType={modifyTagModalOpenType}
        setOpenType={setModifyTagModalOpenType}
        updateTagsList={refreshTagsList}
        existedData={existedListData}
      />
      <div
        className={`fixed z-[9999] flex flex-col overflow-hidden rounded-md bg-bg-100 text-bg-500 dark:bg-bg-800 ${
          contextMenuOpen ? '' : 'hidden'
        } shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)]`}
        style={{
          top: `${contextMenuPosition.y}px`,
          left: `${contextMenuPosition.x}px`
        }}
      >
        <button className="flex items-center gap-2 p-4 hover:bg-bg-200/50 hover:text-bg-800 dark:hover:bg-bg-700 dark:hover:text-bg-100">
          <Icon icon="tabler:pencil" className="h-5 w-5" />
          <span>Edit</span>
        </button>
        <button className="flex items-center gap-2 p-4 text-red-500 hover:bg-bg-200/50 hover:text-red-600 dark:hover:bg-bg-700 dark:hover:text-red-600">
          <Icon icon="tabler:trash" className="h-5 w-5" />
          <span>Delete</span>
        </button>
      </div>
    </>
  )
}

export default Sidebar
