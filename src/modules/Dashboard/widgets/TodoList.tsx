import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import DashboardItem from '@components/utilities/DashboardItem'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { TodoListProvider } from '@providers/TodoListProvider'
import TaskItem from '../../TodoList/components/tasks/TaskItem'

export default function TodoList(): React.ReactElement {
  const { t } = useTranslation()
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entries?status=today'
  )
  const navigate = useNavigate()

  return (
    <DashboardItem
      icon="tabler:clipboard-list"
      title={t('dashboard.widgets.todoList.title')}
    >
      <TodoListProvider>
        <Scrollbar>
          <APIFallbackComponent data={entries}>
            {entries => (
              <div className="flex flex-1 flex-col ">
                <ul className="flex flex-1 flex-col gap-4 px-4 pb-4">
                  {entries.length > 0 ? (
                    entries.map(entry => (
                      <TaskItem
                        entry={entry}
                        key={entry.id}
                        lighter
                        isOuter
                        entries={entries}
                        refreshEntries={refreshEntries}
                        setEntries={setEntries}
                      />
                    ))
                  ) : (
                    <EmptyStateScreen
                      smaller
                      title={t('emptyState.todoList.todaysTask.title')}
                      description={t('emptyState.todoList.todaysTask.desc')}
                      icon="tabler:calendar-smile"
                      ctaContent="new task"
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
