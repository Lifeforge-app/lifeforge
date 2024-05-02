/* eslint-disable @typescript-eslint/indent */
import React from 'react'
import { type ITodoListEntry } from '@typedec/TodoList'
import TaskItem from './TaskItem'
function TaskList({
  entries,
  setEntries,
  refreshEntries,
  lists,
  tagsList,
  setModifyTaskWindowOpenType,
  setSelectedTask
}: {
  entries: ITodoListEntry
  setEntries: React.Dispatch<
    React.SetStateAction<ITodoListEntry | 'loading' | 'error'>
  >
  refreshEntries: () => void
  lists: any
  tagsList: any
  setModifyTaskWindowOpenType: React.Dispatch<
    React.SetStateAction<'create' | 'update' | null>
  >
  setSelectedTask: React.Dispatch<React.SetStateAction<any>>
}): React.ReactElement {
  return (
    <div className="mt-6 flex flex-1 flex-col overflow-y-scroll px-4">
      {(
        [
          ['Pending', entries.pending],
          ['Completed', entries.done]
        ] as Array<[string, ITodoListEntry['pending'] | ITodoListEntry['done']]>
      ).map(
        ([title, entry]) =>
          entry.length > 0 && (
            <div key={title}>
              <h2 className="text-2xl font-semibold text-bg-800 dark:text-bg-100">
                {title} Tasks{' '}
                <span className="text-base text-bg-500">({entry.length})</span>
              </h2>
              <ul className="mt-4 flex flex-1 flex-col gap-4 pb-24 sm:pb-8">
                {entry.map(entry => (
                  <TaskItem
                    entry={entry}
                    entries={entries}
                    setEntries={setEntries}
                    refreshEntries={refreshEntries}
                    lists={lists}
                    tagsList={tagsList}
                    setIsModifyTaskWindowOpen={setModifyTaskWindowOpenType}
                    setSelectedTask={setSelectedTask}
                    key={entry.id}
                  />
                ))}
              </ul>
            </div>
          )
      )}
    </div>
  )
}

export default TaskList
