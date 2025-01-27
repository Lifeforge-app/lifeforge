import { Icon } from '@iconify/react'
import { t } from 'i18next'
import React from 'react'
import { useNavigate } from 'react-router'
import ModuleHeader from '@components/layouts/module/ModuleHeader'
import ModuleWrapper from '@components/layouts/module/ModuleWrapper'
import APIFallbackComponent from '@components/screens/APIComponentWithFallback'
import EmptyStateScreen from '@components/screens/EmptyStateScreen'
import Scrollbar from '@components/utilities/Scrollbar'
import useFetch from '@hooks/useFetch'
import useThemeColors from '@hooks/useThemeColor'
import { type ITodoListEntry } from '@interfaces/todo_list_interfaces'
import { TodoListProvider } from '@providers/TodoListProvider'
import Timer from './components/Timer'
import TaskItem from '../TodoList/components/tasks/TaskItem'

export default function PomodoroTimer(): React.ReactElement {
  const { componentBg } = useThemeColors()
  const [entries, refreshEntries, setEntries] = useFetch<ITodoListEntry[]>(
    'todo-list/entries?status=today'
  )
  const navigate = useNavigate()
  return (
    <ModuleWrapper>
      <ModuleHeader icon="tabler:clock-bolt" title="Pomodoro Timer" />
      <div className="mt-6 flex w-full flex-1">
        <Timer />
        <TodoListProvider>
          <aside className={`mb-16 w-2/6 rounded-lg p-6 ${componentBg}`}>
            <h1 className="mb-8 flex items-center gap-2 text-xl font-semibold">
              <Icon icon="tabler:clipboard-list" className="text-2xl" />
              <span className="ml-2">
                {t('dashboard.widgets.todoList.title')}
              </span>
            </h1>
            <Scrollbar>
              <APIFallbackComponent data={entries}>
                {entries => (
                  <div className="flex flex-1 flex-col ">
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
          </aside>
        </TodoListProvider>
      </div>
    </ModuleWrapper>
  )
}
