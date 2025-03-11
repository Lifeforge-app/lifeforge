import { TodoListProvider } from '@providers/TodoListProvider'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  DashboardItem,
  EmptyStateScreen,
  Scrollbar
} from '@lifeforge/ui'

import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'

import useFetch from '@hooks/useFetch'

import TaskItem from '../../TodoList/components/tasks/TaskItem'

export default function TodoList(): React.ReactElement {
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
                <ul className="flex flex-1 flex-col gap-4 px-4 pb-4">
                  {entries.length > 0 ? (
                    entries.map(entry => (
                      <TaskItem
                        key={entry.id}
                        isOuter
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
                      namespace="modules.dashboard"
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
