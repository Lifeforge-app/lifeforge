/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Icon } from '@iconify/react'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTodoListContext } from '@providers/TodoListProvider'
import APIComponentWithFallback from '../../../../../components/Screens/APIComponentWithFallback'

function TaskStatusList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}): React.ReactElement {
  const { statusCounter } = useTodoListContext()
  const [searchParams, setSearchParams] = useSearchParams()

  return (
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
                  setSidebarOpen(false)
                  return
                }
                setSearchParams({
                  ...Object.fromEntries(searchParams.entries()),
                  status: name.toLowerCase()
                })
                setSidebarOpen(false)
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
  )
}

export default TaskStatusList
