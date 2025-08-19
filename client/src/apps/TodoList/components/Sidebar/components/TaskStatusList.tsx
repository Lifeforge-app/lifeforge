import { SidebarItem, WithQuery } from 'lifeforge-ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function TaskStatusList({
  setSidebarOpen
}: {
  setSidebarOpen: (value: boolean) => void
}) {
  const { statusCounterQuery, filter, setFilter } = useTodoListContext()

  return (
    <WithQuery query={statusCounterQuery}>
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
                filter.status === name.toLowerCase() ||
                (name === 'All' && !filter.status)
              }
              autoActive={false}
              icon={icon}
              label={name}
              namespace="apps.todoList"
              number={
                statusCounter[name.toLowerCase() as keyof typeof statusCounter]
              }
              onClick={() => {
                if (name === 'All') {
                  setFilter('status', null)
                  setSidebarOpen(false)

                  return
                }
                setFilter('status', name.toLowerCase())
                setSidebarOpen(false)
              }}
            />
          ))}
        </>
      )}
    </WithQuery>
  )
}

export default TaskStatusList
