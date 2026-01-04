import { Icon } from '@iconify/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferOutput } from 'shared'

import forgeAPI from '@/utils/forgeAPI'

import ClientModal from '../../ModifyClientModal'

type Client = InferOutput<
  typeof forgeAPI.melvinchia3636$invoice_maker.clients.list
>[number]

function ClientItem({ client }: { client: Client }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.melvinchia3636__invoiceMaker')

  const handleEditClient = useCallback(() => {
    open(ClientModal, {
      type: 'update',
      initialData: client
    })
  }, [client, open])

  const deleteMutation = useMutation(
    forgeAPI.melvinchia3636$invoice_maker.clients.remove
      .input({ id: client.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['invoiceMaker', 'clients']
          })
          toast.success(t('toast.clientDeleted'))
        },
        onError: () => {
          toast.error('Failed to delete client')
        }
      })
  )

  const handleDeleteClient = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Client',
      description: 'Are you sure you want to delete this client?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [deleteMutation, open])

  return (
    <li className="flex-between component-bg-lighter bg-bg-50 shadow-custom flex gap-3 rounded-md p-4">
      <div className="flex w-full min-w-0 items-center gap-3">
        <div className="bg-bg-500/20 rounded-md p-2">
          <Icon className="text-bg-500 size-7" icon="tabler:user" />
        </div>
        <div className="w-full min-w-0">
          <p className="w-full min-w-0 truncate text-lg font-medium">
            {client.name}
          </p>
          {(client.email || client.phone) && (
            <p className="text-bg-500">{client.email || client.phone}</p>
          )}
        </div>
      </div>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditClient}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteClient}
        />
      </ContextMenu>
    </li>
  )
}

export default ClientItem
