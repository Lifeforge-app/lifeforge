import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { SidebarItem } from '@components/layouts/sidebar'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import { useTodoListContext } from '@providers/TodoListProvider'

function TaskStatusList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const [searchParams, setSearchParams] = useSearchParams()
  const { statusCounter } = useTodoListContext()

  return (
    <APIFallbackComponent data={statusCounter}>
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
                  searchParams.delete('status')
                  setSearchParams(searchParams)
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
    </APIFallbackComponent>
  )
}

export default TaskStatusList
