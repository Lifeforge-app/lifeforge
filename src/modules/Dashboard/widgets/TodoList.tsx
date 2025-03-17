import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar
} from '@lifeforge/ui'

import { TodoListProvider } from '@modules/TodoList/providers/TodoListProvider'

import useFetch from '@hooks/useFetch'

import TaskItem from '../../TodoList/components/tasks/TaskItem'
import { type ITodoListEntry } from '../../TodoList/interfaces/todo_list_interfaces'

export default function TodoList() {
  const { t } = useTranslation('modules.todoList')
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entries?status=today'
  )
  const navigate = useNavigate()

  return (
    <DashboardItem icon="tabler:clipboard-list" title="Todo List">
      <TodoListProvider>
        <Scrollbar>
          <APIFallbackComponent data={entries}>
            {entries => (
              <div className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-4">
                  {entries.length > 0 ? (
                    entries.map(entry => (
                      <TaskItem
                        key={entry.id}
                        isInDashboardWidget
                        lighter
                        entries={entries}
                        entry={entry}
                        refreshEntries={refreshEntries}
                        setEntries={setEntries}
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
              </div>
            )}
          </APIFallbackComponent>
        </Scrollbar>
      </TodoListProvider>
    </DashboardItem>
  )
}
