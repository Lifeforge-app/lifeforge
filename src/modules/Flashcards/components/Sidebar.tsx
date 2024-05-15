/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/indent */
import { Icon } from '@iconify/react'
import React from 'react'
import APIComponentWithFallback from '@components/APIComponentWithFallback'
import GoBackButton from '@components/GoBackButton'
import useFetch from '@hooks/useFetch'
import SidebarDivider from '@sidebar/components/SidebarDivider'
import SidebarItem from '@sidebar/components/SidebarItem'
import SidebarTitle from '@sidebar/components/SidebarTitle'
import { type IFlashcardTag } from '@typedec/Flashcard'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const [tagsList] = useFetch<IFlashcardTag[]>('flashcards/tag/list')

  return (
    <>
      <aside
        className={`absolute ${
          sidebarOpen ? 'left-0' : 'left-full'
        } top-0 z-[9999] h-full w-full overflow-y-scroll rounded-lg bg-bg-50 py-4 shadow-custom duration-300 dark:bg-bg-900 lg:static lg:h-[calc(100%-3rem)] lg:w-4/12 xl:w-1/4`}
      >
        <div className="flex items-center justify-between px-8 py-4 lg:hidden">
          <GoBackButton
            onClick={() => {
              setSidebarOpen(false)
            }}
          />
        </div>
        <ul className="flex flex-col overflow-y-hidden hover:overflow-y-scroll">
          <SidebarItem icon="tabler:cards" name="All Decks" />
          <SidebarDivider />
          <SidebarTitle name="progress" />
          {[
            ['tabler:check', 'Completed'],
            ['tabler:clock', 'In Progress'],
            ['tabler:zzz', 'Not Started']
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
          <SidebarTitle name="Tags" />
          <APIComponentWithFallback data={tagsList}>
            {typeof tagsList !== 'string' &&
              tagsList.map((tag, index) => (
                <li
                  key={index}
                  className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
                >
                  <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-200/50 dark:hover:bg-bg-800">
                    <div className="flex w-full items-center gap-6">
                      <span
                        className="block h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: tag.color
                        }}
                      />
                      {tag.name}
                    </div>
                    <span className="ml-auto text-sm">
                      {Math.floor(Math.random() * 10)}
                    </span>
                  </div>
                </li>
              ))}
          </APIComponentWithFallback>
        </ul>
      </aside>
    </>
  )
}

export default Sidebar
