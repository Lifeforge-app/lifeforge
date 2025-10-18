/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react'
import clsx from 'clsx'
import { Button } from 'lifeforge-ui'
import React, { useMemo, useState } from 'react'

import { isFolder } from '../utils/locales'
import LocaleInput from './LocaleInput'

function NestedItem({
  name,
  value,
  path,
  setValue,
  changedKeys,
  setChangedKeys,
  oldLocales,
  searchQuery,
  onCreateEntry,
  onRenameEntry,
  onDeleteEntry,
  fetchSuggestions
}: {
  name: string
  value: Record<string, any>
  path: string[]
  setValue: (lng: string, path: string[], value: string) => void
  changedKeys: string[]
  setChangedKeys: React.Dispatch<React.SetStateAction<string[]>>
  oldLocales: Record<string, any> | 'loading' | 'error'
  searchQuery: string
  onCreateEntry: (parent: string) => void
  onDeleteEntry: (path: string) => void
  onRenameEntry: (path: string) => void
  fetchSuggestions: (path: string) => Promise<void>
}): React.ReactElement {
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)

  const [collapsed, setCollapsed] = useState(true)

  const filteredEntries = useMemo(
    () =>
      Object.entries(value)
        .filter(([key]) => {
          return (
            path.concat(key).join('.').startsWith(searchQuery) ||
            searchQuery.startsWith(path.concat(key).join('.'))
          )
        })
        .sort((a, b) => {
          if (typeof a[1] === 'string' && typeof b[1] === 'string') {
            return 0
          }

          const aIsFolder = isFolder(a[1])

          const bIsFolder = isFolder(b[1])

          if (aIsFolder === bIsFolder) {
            return a[0].localeCompare(b[0])
          }

          return aIsFolder ? -1 : 1
        }),
    [value, path, searchQuery]
  )

  return (
    <li
      className={clsx(
        'my-4 w-full border-l-2 shadow-md',
        changedKeys.some(key => key.startsWith(path.join('.'))) &&
          'border-yellow-500!',
        collapsed
          ? 'border-bg-300 dark:border-bg-500'
          : 'border-bg-900 dark:border-bg-100 bg-bg-700/10'
      )}
    >
      <button
        className="flex-between hover:bg-bg-200 dark:hover:bg-bg-900 w-full gap-8 p-4 transition-all"
        onClick={() => {
          setCollapsed(!collapsed)
        }}
      >
        <code className="flex items-center gap-2">
          <Icon
            className="size-6"
            icon={!isFolder(value) ? 'tabler:file-text' : 'tabler:folder'}
          />
          {name}
        </code>
        <div className="flex items-center gap-2">
          {isFolder(value) ? (
            <Button
              className="p-2!"
              icon="tabler:plus"
              variant="plain"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                onCreateEntry(path.join('.'))
              }}
            />
          ) : (
            <Button
              className="p-2!"
              icon="mage:stars-c"
              loading={suggestionsLoading}
              variant="plain"
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setSuggestionsLoading(true)
                fetchSuggestions(path.join('.')).finally(() => {
                  setSuggestionsLoading(false)
                })
              }}
            />
          )}
          <Button
            className="p-2!"
            icon="tabler:pencil"
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onRenameEntry(path.join('.'))
            }}
          />
          <Button
            dangerous
            className="p-2!"
            icon="tabler:trash"
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()
              onDeleteEntry(path.join('.'))
            }}
          />
          <div className="p-2">
            <Icon
              className="text-bg-500 size-5"
              icon={collapsed ? 'tabler:chevron-up' : 'tabler:chevron-down'}
            />
          </div>
        </div>
      </button>
      {!collapsed && (
        <ul className="mt-4 space-y-2 px-4 pb-4">
          {(() => {
            if (!filteredEntries.length) {
              return (
                <p className="text-bg-500 mb-4 text-center">
                  No entries found.
                </p>
              )
            }

            return filteredEntries.map(([key, value]) =>
              typeof value === 'string' ? (
                <li key={key} className="flex items-center gap-2">
                  <LocaleInput
                    name={key}
                    oldLocales={oldLocales}
                    path={path}
                    setChangedKeys={setChangedKeys}
                    setValue={setValue}
                    value={value}
                  />
                </li>
              ) : (
                <NestedItem
                  key={key}
                  changedKeys={changedKeys}
                  fetchSuggestions={fetchSuggestions}
                  name={key}
                  oldLocales={oldLocales}
                  path={path.concat(key)}
                  searchQuery={searchQuery}
                  setChangedKeys={setChangedKeys}
                  setValue={setValue}
                  value={value}
                  onCreateEntry={onCreateEntry}
                  onDeleteEntry={onDeleteEntry}
                  onRenameEntry={onRenameEntry}
                />
              )
            )
          })()}
        </ul>
      )}
    </li>
  )
}

export default NestedItem
