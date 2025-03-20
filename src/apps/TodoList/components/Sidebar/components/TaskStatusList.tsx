import { useSearchParams } from 'react-router'

import { QueryWrapper, SidebarItem } from '@lifeforge/ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function TaskStatusList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { statusCounterQuery } = useTodoListContext()

  return (
    <QueryWrapper query={statusCounterQuery}>
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
              active={
                searchParams.get('status') === name.toLowerCase() ||
                (name === 'All' && !searchParams.get('status'))
              }
              autoActive={false}
              icon={icon}
              name={name}
              namespace="apps.todoList"
              number={
                statusCounter[name.toLowerCase() as keyof typeof statusCounter]
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
            />
          ))}
        </>
      )}
    </QueryWrapper>
  )
}

export default TaskStatusList
