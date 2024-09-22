/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import SidebarItem from '@components/Sidebar/components/SidebarItem'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskStatusList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { statusCounter } = useTodoListContext()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <APIComponentWithFallback data={statusCounter}>
      {statusCounter => (
        <>
          {[
            ['tabler:article', 'All'],
            ['tabler:calendar-exclamation', 'Today'],
            ['tabler:calendar-up', 'Scheduled'],
            ['tabler:calendar-x', 'Overdue'],
            ['tabler:calendar-check', 'Completed']
          ].map(([icon, name]) => (
            <SidebarItem
              key={name}
              icon={icon}
              name={name}
              active={
                searchParams.get('status') === name.toLowerCase() ||
                (name === 'All' && !searchParams.get('status'))
              }
              onClick={() => {
                if (name === 'All') {
                  setSearchParams(searchParams => {
                    searchParams.delete('status')
                    return searchParams
                  })
                  setSidebarOpen(false)
                  return
                }
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  status: name.toLowerCase()
                })
                setSidebarOpen(false)
              }}
              autoActive={false}
              number={
                statusCounter[name.toLowerCase() as keyof typeof statusCounter]
              }
            />
          ))}
        </>
      )}
    </APIComponentWithFallback>
  )
}

export default TaskStatusList
