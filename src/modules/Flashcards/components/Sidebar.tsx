/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { Icon } from '@iconify/react'
import React from 'react'
import APIFallbackComponent from '@components/Screens/APIComponentWithFallback'
import SidebarDivider from '@components/Sidebar/components/SidebarDivider'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import SidebarTitle from '@components/Sidebar/components/SidebarTitle'
import SidebarWrapper from '@components/Sidebar/components/SidebarWrapper'
import useFetch from '@hooks/useFetch'
import { type IFlashcardTag } from '@interfaces/flashcard_interfaces'

function Sidebar({
  sidebarOpen,
  setSidebarOpen
}: {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const [tagsList] = useFetch<IFlashcardTag[]>('flashcards/tag/list')

  return (
    <SidebarWrapper isOpen={sidebarOpen} setOpen={setSidebarOpen}>
      <SidebarItem
        autoActive
        onClick={() => {}}
        icon="tabler:cards"
        name="All Decks"
      />
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
          <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800">
            <Icon icon={icon} className="size-6 shrink-0" />
            <div className="flex-between flex w-full">{name}</div>
            <span className="text-sm">{Math.floor(Math.random() * 10)}</span>
          </div>
        </li>
      ))}

      <SidebarDivider />
      <SidebarTitle name="Tags" />
      <APIFallbackComponent data={tagsList}>
        {tagsList => (
          <>
            {tagsList.map((tag, index) => (
              <li
                key={index}
                className="relative flex items-center gap-6 px-4 font-medium text-bg-500 transition-all"
              >
                <div className="flex w-full items-center gap-6 whitespace-nowrap rounded-lg p-4 hover:bg-bg-100 dark:hover:bg-bg-800">
                  <div className="flex w-full items-center gap-6">
                    <span
                      className="block size-2 shrink-0 rounded-full"
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
          </>
        )}
      </APIFallbackComponent>
    </SidebarWrapper>
  )
}

export default Sidebar
