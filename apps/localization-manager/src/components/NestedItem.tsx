/* eslint-disable @typescript-eslint/no-explicit-any */
import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Button, ConfirmationModal, useModalStore } from 'lifeforge-ui'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { useLocaleManager } from '../providers/LocaleManagerProvider'
import forgeAPI from '../utils/forgeAPI'
import { isFolder } from '../utils/locales'
import LocaleInput from './LocaleInput'

function NestedItem({
  name,
  value,
  path,
  searchQuery
}: {
  name: string
  value: Record<string, any>
  path: string[]
  searchQuery: string
}) {
  const { t } = useTranslation('utils.localeAdmin')

  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { namespace, subNamespace } = useLocaleManager()

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

  const deleteMutation = useMutation(
    forgeAPI.locales.manager.remove
      .input({
        namespace: namespace!,
        subnamespace: subNamespace!
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['locales', 'manager'] })
        },
        onError: () => {
          toast.error('Failed to delete entry')
        }
      })
  )

  return (
    <div
      className={clsx(
        'mt-2 w-full border-l-2',
        collapsed ? 'border-bg-300 dark:border-bg-700' : 'border-custom-500'
      )}
    >
      <button
        className="flex-between w-full gap-8 p-4 transition-all"
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
            }}
          />
          <Button
            isRed
            className="p-2!"
            icon="tabler:trash"
            variant="plain"
            onClick={e => {
              e.preventDefault()
              e.stopPropagation()

              open(ConfirmationModal, {
                title: t('modals.deleteEntry.title'),
                description: t('modals.deleteEntry.description'),
                buttonType: 'delete',
                onConfirm: async () => {
                  await deleteMutation.mutateAsync({
                    path: path.join('.')
                  })
                }
              })
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
        <ul className="space-y-2 px-4 pb-4">
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
                  <LocaleInput name={key} value={value} />
                </li>
              ) : (
                <NestedItem
                  key={key}
                  name={key}
                  path={path.concat(key)}
                  searchQuery={searchQuery}
                  value={value}
                />
              )
            )
          })()}
        </ul>
      )}
    </div>
  )
}

export default NestedItem
