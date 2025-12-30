import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  OptionsColumn,
  TagChip
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import COLORS from 'tailwindcss/colors'

import ROUTES from '@/routes'
import forgeAPI from '@/utils/forgeAPI'

import type { APIKeysEntry } from '..'
import ModifyAPIKeyModal from '../modals/ModifyAPIKeyModal'
import ModulesRequiredListModal from '../modals/ModulesRequiredListModal'

function EntryItem({ entry }: { entry: APIKeysEntry }) {
  const { t } = useTranslation('common.apiKeys')

  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const [isCopying, setIsCopying] = useState(false)

  const deleteMutation = useMutation(
    forgeAPI.apiKeys.entries.remove
      .input({
        id: entry.id
      })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['apiKeys']
          })
          toast.success('API Key deleted successfully')
        },
        onError: () => {
          toast.error('Failed to delete API Key')
        }
      })
  )

  const modulesRequiredCount = ROUTES.flatMap(cat => cat.items).filter(
    item => item.APIKeyAccess?.[entry.keyId]
  ).length

  async function copyKey() {
    setIsCopying(true)

    try {
      const key = await forgeAPI.apiKeys.entries.get
        .input({
          keyId: entry.id
        })
        .query()

      copy(key)
      toast.success('Key copied to clipboard')
    } catch (err) {
      console.error(err)
      toast.error('Failed to fetch key')
    } finally {
      setIsCopying(false)
    }
  }

  const handleUpdateEntry = useCallback(async () => {
    try {
      open(ModifyAPIKeyModal, {
        type: 'update',
        initialData: {
          ...entry
        }
      })
    } catch {
      toast.error('Failed to fetch API Key')
    }
  }, [entry])

  const handleDeleteEntry = () =>
    open(ConfirmationModal, {
      title: 'Delete API Key',
      description: `Are you sure you want to delete the API Key "${entry.name}"? This action cannot be undone.`,
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })

  return (
    <OptionsColumn
      key={entry.id}
      description={
        modulesRequiredCount > 0 && (
          <p className="text-bg-500 mt-2 flex items-center gap-1">
            {t('misc.requiredBy', { count: modulesRequiredCount })}
            <Button
              className="p-1!"
              icon="tabler:info-circle"
              variant="plain"
              onClick={() =>
                open(ModulesRequiredListModal, {
                  keyId: entry.keyId
                })
              }
            />
          </p>
        )
      }
      icon={entry.icon}
      title={
        <>
          {entry.name}
          <code className="text-bg-500 text-sm">({entry.keyId})</code>
          <TagChip
            className="ml-2 text-xs!"
            color={entry.exposable ? COLORS.green['500'] : COLORS.red['500']}
            icon={entry.exposable ? 'tabler:world' : 'tabler:lock'}
            iconClassName="size-3.5!"
            label={
              entry.exposable ? t('misc.exposable') : t('misc.internalOnly')
            }
          />
        </>
      }
    >
      <div className="w-full">
        <code className="flex items-center gap-1 text-lg md:justify-end">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <Icon key={i} className="size-1" icon="tabler:circle-filled" />
            ))}
          <span className="ml-0.5">{entry.key}</span>
        </code>
        <span className="text-bg-500 text-sm">
          {t('misc.lastUpdated', { time: dayjs(entry.updated).fromNow() })}
        </span>
      </div>
      <div className="ml-2 flex gap-2">
        {entry.exposable && (
          <Button
            className="shrink-0"
            icon="tabler:copy"
            loading={isCopying}
            variant="plain"
            onClick={() => {
              copyKey().catch(console.error)
            }}
          />
        )}
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="edit"
            onClick={handleUpdateEntry}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="delete"
            onClick={handleDeleteEntry}
          />
        </ContextMenu>
      </div>
    </OptionsColumn>
  )
}

export default EntryItem
