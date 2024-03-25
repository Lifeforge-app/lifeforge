/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import React, { useEffect, useState } from 'react'
import SidebarDivider from '../../../components/Sidebar/components/SidebarDivider'
import SidebarTitle from '../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import GoBackButton from '../../../components/general/GoBackButton'
import ModifyListModal from './ModifyListModal'
import ModifyTagModal from './ModifyTagModal'

export interface ITodoListList {
  collectionId: string
  collectionName: string
  color: string
  created: string
  icon: string
  id: string
  name: string
  updated: string
  amount: number
}

export interface ITodoListTag {
  amount: number
  collectionId: string
  collectionName: string
  color: string
  created: string
  id: string
  name: string
  updated: string
}

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  lists,
  refreshLists,
  tags,
  refreshTagsList
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  lists: ITodoListList[] | 'loading' | 'error'
  refreshLists: () => void
  tags: ITodoListTag[] | 'loading' | 'error'
  refreshTagsList: () => void
}): React.ReactElement {
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
          {[
            ['tabler:article', 'All'],
            ['tabler:calendar-exclamation', 'Today'],
            ['tabler:calendar-up', 'Scheduled'],
            ['tabler:calendar-x', 'Overdue'],
            ['tabler:calendar-check', 'Completed']
          ].map(([icon, name], index) => (
            <li
              key={index}
              className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
            >
              <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                <Icon icon={icon} className="h-6 w-6 shrink-0" />
                <div className="flex w-full items-center justify-between">
                  {name}
                </div>
                <span className="text-sm">
                  {Math.floor(Math.random() * 10)}
                </span>
              </div>
            </li>
          ))}

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
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                      <span
                        className="block h-8 w-1.5 shrink-0 rounded-full"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <Icon icon={icon} className="h-6 w-6 shrink-0" />
                      <div className="w-full truncate">{name}</div>
                      <span className="text-sm">{amount}</span>
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
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                      <Icon icon="tabler:hash" className="h-5 w-5 shrink-0" />
                      <p className="w-full truncate">{name}</p>
                      <span className="text-sm">{amount}</span>
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
