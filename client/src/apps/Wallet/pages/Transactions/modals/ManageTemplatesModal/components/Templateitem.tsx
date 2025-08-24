import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import clsx from 'clsx'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { toast } from 'react-toastify'

import type { WalletTemplate } from '@apps/Wallet/hooks/useWalletData'

import ModifyTemplatesModal from '../../ModifyTemplatesModal'
import ModifyTransactionsModal from '../../ModifyTransactionsModal'

function TemplateItem({
  template,
  choosing,
  onClose
}: {
  template: WalletTemplate
  choosing: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const handleEditTemplate = useCallback(() => {
    open(ModifyTemplatesModal, {
      type: 'update',
      initialData: template
    })
  }, [template])

  const deleteMutation = useMutation(
    forgeAPI.wallet.templates.remove
      .input({ id: template.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wallet', 'templates'] })
        },
        onError: () => {
          toast.error('Failed to delete template')
        }
      })
  )

  const handleDeleteTemplate = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Template',
      description: 'Are you sure you want to delete this template?',
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [])

  return (
    <button
      key={template.id}
      className={clsx(
        'flex-between shadow-custom flex w-full min-w-0 gap-3 rounded-md p-4 text-left',
        !choosing
          ? 'component-bg-lighter bg-bg-50 cursor-default!'
          : 'component-bg-lighter-with-hover cursor-pointer'
      )}
      onClick={
        choosing
          ? () => {
              onClose()
              open(ModifyTransactionsModal, {
                type: 'create',
                initialData: template
              })
            }
          : undefined
      }
    >
      <div className="flex w-full min-w-0 items-center gap-3">
        <Icon className="text-bg-500 size-7 shrink-0" icon="tabler:template" />
        <p className="w-full min-w-0 truncate text-lg font-medium">
          {template.name}
        </p>
      </div>
      {!choosing && (
        <ContextMenu>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={handleEditTemplate}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={handleDeleteTemplate}
          />
        </ContextMenu>
      )}
    </button>
  )
}

export default TemplateItem
