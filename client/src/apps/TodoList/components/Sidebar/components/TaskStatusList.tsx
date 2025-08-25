import { SidebarItem, WithQuery } from 'lifeforge-ui'

import { useTodoListContext } from '@apps/TodoList/providers/TodoListProvider'

function TaskStatusList() {
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
                setFilter('status', name === 'All' ? null : name.toLowerCase())
              }}
            />
          ))}
        </>
      )}
    </WithQuery>
  )
}

export default TaskStatusList
