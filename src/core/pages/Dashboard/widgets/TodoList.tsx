import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  DashboardItem,
  EmptyStateScreen,
  QueryWrapper,
  Scrollbar
} from '@lifeforge/ui'

import TaskItem from '@apps/TodoList/components/tasks/TaskItem'
import {
  TodoListProvider,
  useTodoListContext
} from '@apps/TodoList/providers/TodoListProvider'

function TodoListContent() {
  const { t } = useTranslation('apps.todoList')
  const navigate = useNavigate()
  const { entriesQuery } = useTodoListContext()

  return (
    <QueryWrapper query={entriesQuery}>
      {entries => (
        <ul className="flex flex-1 flex-col gap-4">
          {entries.length > 0 ? (
            entries.map(entry => (
              <TaskItem
                key={entry.id}
                isInDashboardWidget
                lighter
                entry={entry}
              />
            ))
          ) : (
            <EmptyStateScreen
              smaller
              ctaContent="new"
              ctaTProps={{
                item: t('items.task')
              }}
              icon="tabler:calendar-smile"
              name="today"
              namespace="core.dashboard"
              tKey="widgets.todoList"
              onCTAClick={() => {
                navigate('/todo-list#new')
              }}
            />
          )}
        </ul>
      )}
    </QueryWrapper>
  )
}

export default function TodoList() {
  return (
    <DashboardItem icon="tabler:clipboard-list" title="Todo List">
      <TodoListProvider>
        <Scrollbar>
          <TodoListContent />
        </Scrollbar>
      </TodoListProvider>
    </DashboardItem>
  )
}
