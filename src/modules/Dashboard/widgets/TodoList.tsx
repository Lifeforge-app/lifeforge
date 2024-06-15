import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { TodoListProvider } from '@providers/TodoListProvider'
import TaskItem from '../../TodoList/components/tasks/TaskItem'

export default function TodoList(): React.ReactElement {
  const { t } = useTranslation()
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entry/list?status=today'
  )
  const navigate = useNavigate()

  return (
    <div className="flex size-full flex-col gap-4 rounded-lg bg-bg-50 p-6 shadow-custom dark:bg-bg-900">
      <h1 className="mb-2 flex items-center gap-2 text-xl font-semibold">
        <Icon icon="tabler:clipboard-list" className="text-2xl" />
        <span className="ml-2">{t('dashboard.widgets.todoList.title')}</span>
      </h1>
      <TodoListProvider>
        <APIComponentWithFallback data={entries}>
          <div className="flex flex-1 flex-col overflow-y-scroll ">
            {typeof entries !== 'string' && (
              <ul className="flex flex-1 flex-col gap-4 pb-24 sm:pb-8">
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
                    title="No tasks for today"
                    description="Head to the Todo List module to create a new task."
                    icon="tabler:calendar-smile"
                    ctaContent="new task"
                    setModifyModalOpenType={() => {
                      navigate('/todo-list#new')
                    }}
                  />
                )}
              </ul>
            )}
          </div>
        </APIComponentWithFallback>
      </TodoListProvider>
    </div>
  )
}
