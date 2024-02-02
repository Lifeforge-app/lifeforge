/* eslint-disable @typescript-eslint/indent */
import React, { useState } from 'react'
import SidebarDivider from '../../../components/Sidebar/components/SidebarDivider'
import SidebarTitle from '../../../components/Sidebar/components/SidebarTitle'
import { Icon } from '@iconify/react'
import APIComponentWithFallback from '../../../components/general/APIComponentWithFallback'
import GoBackButton from '../../../components/general/GoBackButton'
import ModifyListModal from './ModifyListModal'

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
  tags
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  lists: ITodoListList[] | 'loading' | 'error'
  refreshLists: () => void
  tags: ITodoListTag[] | 'loading' | 'error'
}): React.JSX.Element {
  const [modifyListModalOpenType, setModifyListModalOpenType] = useState<
    'create' | 'update' | null
  >(null)
  const [existedData, setExistedData] = useState<ITodoListList | null>(null)

  return (
    <>
      <aside
        className={`absolute ${
          sidebarOpen ? 'left-0' : 'left-full'
        } top-0 z-[9999] h-full w-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-[4px_4px_10px_0px_rgba(0,0,0,0.05)] duration-300 dark:bg-bg-800/50 lg:static lg:w-4/12 xl:w-1/4`}
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
              className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
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
              setExistedData(null)
            }}
          />
          <APIComponentWithFallback data={lists}>
            {typeof lists !== 'string' && (
              <>
                {lists.map(({ icon, name, color, id, amount }) => (
                  <li
                    key={id}
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                      <span
                        className="block h-8 w-1.5 rounded-full"
                        style={{
                          backgroundColor: color
                        }}
                      />
                      <Icon icon={icon} className="h-6 w-6 shrink-0" />
                      <div className="flex w-full items-center justify-between">
                        {name}
                      </div>
                      <span className="text-sm">{amount}</span>
                    </div>
                  </li>
                ))}
              </>
            )}
          </APIComponentWithFallback>
          <SidebarDivider />
          <SidebarTitle name="Tags" />
          <APIComponentWithFallback data={tags}>
            {typeof tags !== 'string' && (
              <>
                {tags.map(({ id, name, amount }) => (
                  <li
                    key={id}
                    className="relative flex items-center gap-6 px-4 font-medium text-bg-400 transition-all"
                  >
                    <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-800">
                      <Icon icon="tabler:hash" className="h-5 w-5 shrink-0" />
                      <div className="flex w-full items-center justify-between">
                        {name}
                      </div>
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
        existedData={existedData}
      />
    </>
  )
}

export default Sidebar
