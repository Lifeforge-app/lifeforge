/* eslint-disable @typescript-eslint/no-explicit-any */
import { ErrorScreen, LoadingScreen } from 'lifeforge-ui'
import React, { useMemo } from 'react'

import { isFolder } from '../../utils/locales'
import NestedItem from './NestedItem'

function LocaleEditor({
  oldLocales,
  locales,
  setValue,
  changedKeys,
  setChangedKeys,
  searchQuery,
  onCreateEntry,
  onRenameEntry,
  onDeleteEntry,
  fetchSuggestions
}: {
  oldLocales: Record<string, any> | 'loading' | 'error'
  locales: Record<string, any> | 'loading' | 'error'
  setValue: (lng: string, path: string[], value: string) => void
  changedKeys: string[]
  setChangedKeys: React.Dispatch<React.SetStateAction<string[]>>
  searchQuery: string
  onCreateEntry: (parent: string) => void
  onRenameEntry: (path: string) => void
  onDeleteEntry: (path: string) => void
  fetchSuggestions: (path: string) => Promise<void>
}) {
  const reconstructedLocales = useMemo<Record<string, any>>(() => {
    if (typeof locales === 'string') {
      return {}
    }

    const final: Record<string, any> = {}

    const recursivelyReconstruct = (
      obj: Record<string, any>,
      path: string[] = []
    ) => {
      path = path.filter(Boolean)

      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          let target = final

          const toBeTraversed = path.concat(key)

          for (let i = 0; i < toBeTraversed.length; i++) {
            if (!target[toBeTraversed[i]]) {
              target[toBeTraversed[i]] = {}
            }

            target = target[toBeTraversed[i]]
          }

          for (const lng of Object.keys(locales)) {
            let lngTarget = locales[lng]

            for (let j = 0; j < toBeTraversed.length; j++) {
              lngTarget = lngTarget[toBeTraversed[j]]
            }

            target[lng] = lngTarget
          }
        } else {
          if (JSON.stringify(obj[key]) === '{}') {
            let target = final

            const toBeTraversed = path

            for (let i = 0; i < toBeTraversed.length; i++) {
              if (!target[toBeTraversed[i]]) {
                target[toBeTraversed[i]] = {}
              }

              target = target[toBeTraversed[i]]
            }

            target[key] = {}
          }
          recursivelyReconstruct(obj[key], path.concat(key))
        }
      }
    }

    recursivelyReconstruct(locales.en)

    return final
  }, [locales])

  if (oldLocales === 'loading' || locales === 'loading') {
    return <LoadingScreen />
  }

  if (oldLocales === 'error' || locales === 'error') {
    return <ErrorScreen message="Failed to fetch locales" />
  }

  return (
    <ul>
      {Object.entries(reconstructedLocales)
        .sort((a, b) => {
          const aIsFolder = isFolder(a[1])

          const bIsFolder = isFolder(b[1])

          if (aIsFolder === bIsFolder) {
            return a[0].localeCompare(b[0])
          }

          return aIsFolder ? -1 : 1
        })
        .filter(([key]) => searchQuery.includes(key) || searchQuery === '')
        .map(([key, value]) => (
          <NestedItem
            key={key}
            changedKeys={changedKeys}
            fetchSuggestions={fetchSuggestions}
            name={key}
            oldLocales={oldLocales}
            path={[key]}
            searchQuery={searchQuery}
            setChangedKeys={setChangedKeys}
            setValue={setValue}
            value={value}
            onCreateEntry={onCreateEntry}
            onDeleteEntry={onDeleteEntry}
            onRenameEntry={onRenameEntry}
          />
        ))}
    </ul>
  )
}

export default LocaleEditor
