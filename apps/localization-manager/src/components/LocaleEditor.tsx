/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'

import { isFolder } from '../utils/locales'
import NestedItem from './NestedItem'

function LocaleEditor({
  locales,
  searchQuery
}: {
  locales: Record<string, any>
  searchQuery: string
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
            name={key}
            path={[key]}
            searchQuery={searchQuery}
            value={value}
          />
        ))}
    </ul>
  )
}

export default LocaleEditor
