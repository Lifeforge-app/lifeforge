import {
  Button,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar,
  WithQuery
} from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import type { WidgetConfig } from 'shared'

import TaskItem from '@apps/01.Productivity/todoList/components/tasks/TaskItem'
import {
  TodoListProvider,
  useTodoListContext
} from '@apps/01.Productivity/todoList/providers/TodoListProvider'

function TodoListContent() {
  const { t } = useTranslation('apps.todoList')

  const navigate = useNavigate()

  const { entriesQuery } = useTodoListContext()

  return (
    <WithQuery query={entriesQuery}>
      {entries => (
        <ul className="flex flex-1 flex-col gap-2 pr-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <TaskItem
                key={entry.id}
                isInDashboardWidget
                className="component-bg-lighter-with-hover"
                entry={entry}
              />
            ))
          ) : (
            <EmptyStateScreen
              smaller
              CTAButtonProps={{
                icon: 'tabler:plus',
                tProps: { item: t('items.task') },
                children: 'new',
                onClick: () => {
                  navigate('/todo-list#new')
                }
              }}
              icon="tabler:calendar-smile"
              name="today"
              namespace="apps.dashboard"
              tKey="widgets.todoList"
            />
          )}
        </ul>
      )}
    </WithQuery>
  )
}

export default function TodoList() {
  return (
    <DashboardItem
      className="pr-3"
      componentBesideTitle={
        <Button
          as={Link}
          className="mr-3 p-2!"
          icon="tabler:chevron-right"
          to="/todo-list"
          variant="plain"
        />
      }
      icon="tabler:clipboard-list"
      title="Todo List"
    >
      <TodoListProvider>
        <Scrollbar>
          <TodoListContent />
        </Scrollbar>
      </TodoListProvider>
    </DashboardItem>
  )
}

export const config: WidgetConfig = {
  namespace: 'apps.todoList',
  id: 'todoList',
  icon: 'tabler:checklist'
}
