import { Icon } from '@iconify/react'
import clsx from 'clsx'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import {
  APIFallbackComponent,
  EmptyStateScreen,
  Scrollbar
, ModuleWrapper , ModuleHeader } from '@lifeforge/ui'

import { TodoListProvider } from '@modules/TodoList/providers/TodoListProvider'

import useComponentBg from '@hooks/useComponentBg'
import useFetch from '@hooks/useFetch'

import TaskItem from '../TodoList/components/tasks/TaskItem'
import { type ITodoListEntry } from '../TodoList/interfaces/todo_list_interfaces'
import Timer from './components/Timer'

export default function PomodoroTimer(): React.ReactElement {
  const { componentBg } = useComponentBg()
  const { t } = useTranslation('modules.todoList')
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
          <aside className={clsx('mb-16 w-2/6 rounded-lg p-6', componentBg)}>
            <h1 className="mb-8 flex items-center gap-2 text-xl font-semibold">
              <Icon className="text-2xl" icon="tabler:clipboard-list" />
              <span className="ml-2">{t('title')}</span>
            </h1>
            <Scrollbar>
              <APIFallbackComponent data={entries}>
                {entries => (
                  <div className="flex flex-1 flex-col">
                    <ul className="flex flex-1 flex-col gap-4 pb-24 sm:pb-8">
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
                          ctaContent="new"
                          ctaTProps={{
                            item: t('items.task')
                          }}
                          icon="tabler:calendar-smile"
                          name="todaysTask"
                          namespace="modules.todoList"
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
