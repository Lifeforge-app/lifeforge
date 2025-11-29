import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import copy from 'copy-to-clipboard'
import dayjs from 'dayjs'
import {
  Button,
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  OptionsColumn
} from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'

import ModifyAPIKeyModal from '../modals/ModifyAPIKeyModal'
import decryptKey from '../utils/decryptKey'
import type { APIKeysEntry } from './ContentContainer'

function EntryItem({
  entry,
  masterPassword
}: {
  entry: APIKeysEntry
  masterPassword: string
}) {
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

  async function copyKey() {
    setIsCopying(true)

    try {
      copy(await decryptKey({ entry, masterPassword }))
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
          ...entry,
          key: await decryptKey({ entry, masterPassword })
        },
        masterPassword
      })
    } catch {
      toast.error('Failed to fetch API Key')
    }
  }, [entry, masterPassword])

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
      description={entry.description}
      icon={entry.icon}
      title={
        <>
          {entry.name}
          <code className="text-bg-500 text-sm">({entry.keyId})</code>
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
          Last updated: {dayjs(entry.updated).fromNow()}
        </span>
      </div>
      <div className="ml-2 flex gap-2">
        <Button
          className="shrink-0"
          icon="tabler:copy"
          loading={isCopying}
          variant="plain"
          onClick={() => {
            copyKey().catch(console.error)
          }}
        />
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
