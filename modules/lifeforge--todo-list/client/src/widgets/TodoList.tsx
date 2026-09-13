import { Link, useNavigate } from 'react-router'

import type { WidgetConfig } from '@lifeforge/configs'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  Button,
  EmptyStateScreen,
  Scrollbar,
  Stack,
  Widget,
  WithQuery,
  surface
} from '@lifeforge/ui'

import TaskItem from '@/components/tasks/TaskItem'
import {
  TodoListProvider,
  useTodoListContext
} from '@/providers/TodoListProvider'

function TodoListContent() {
  const { t } = useModuleTranslation()
  const navigate = useNavigate()
  const { entriesQuery } = useTodoListContext()

  return (
    <WithQuery query={entriesQuery}>
      {entries => (
        <Stack as="ul" flex="1" pr="md">
          {entries.length > 0 ? (
            entries.map(entry => (
              <TaskItem
                key={entry.id}
                isInDashboardWidget
                bg={surface.light}
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
              message={{
                id: 'today',
                tKey: 'widgets.todoList'
              }}
            />
          )}
        </Stack>
      )}
    </WithQuery>
  )
}

export default function TodoList() {
  return (
    <Widget
      actionComponent={
        <Button
          as={Link}
          icon="tabler:chevron-right"
          mr="sm"
          p="sm"
          to="/todo-list"
          variant="plain"
        />
      }
      icon="tabler:clipboard-list"
      pr="md"
      title="Todo List"
    >
      <TodoListProvider>
        <Scrollbar>
          <TodoListContent />
        </Scrollbar>
      </TodoListProvider>
    </Widget>
  )
}

export const config: WidgetConfig = {
  id: 'todoList',
  icon: 'tabler:checklist'
}
