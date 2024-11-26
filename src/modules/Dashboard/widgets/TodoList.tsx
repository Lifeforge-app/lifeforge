import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import Scrollbar from '@components/Miscellaneous/Scrollbar'
import APIComponentWithFallback from '@components/Screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/Screens/EmptyStateScreen'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { TodoListProvider } from '@providers/TodoListProvider'
import TaskItem from '../../TodoList/components/tasks/TaskItem'

export default function TodoList(): React.ReactElement {
  const { componentBg } = useThemeColors()
  const { t } = useTranslation()
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entries?status=today'
  )
  const navigate = useNavigate()

  return (
    <div
      className={`flex size-full flex-col gap-4 rounded-lg p-4 shadow-custom ${componentBg}`}
    >
      <h1 className="mb-2 flex items-center gap-2 px-4 text-xl font-semibold">
        <Icon icon="tabler:clipboard-list" className="text-2xl" />
        <span className="ml-2">{t('dashboard.widgets.todoList.title')}</span>
      </h1>
      <TodoListProvider>
        <Scrollbar>
          <APIComponentWithFallback data={entries}>
            {entries => (
              <div className="flex flex-1 flex-col ">
                <ul className="flex flex-1 flex-col gap-4 px-4 pb-24 sm:pb-8">
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
          </APIComponentWithFallback>
        </Scrollbar>
      </TodoListProvider>
    </div>
  )
}
