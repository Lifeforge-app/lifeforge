import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'

import type { WalletLedger } from '@apps/Wallet/hooks/useWalletData'

function ModifyLedgerModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: WalletLedger
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wallet.ledgers.create
      : forgeAPI.wallet.ledgers.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'ledgers'] })
      },
      onError: error => {
        toast.error(
          `Failed to ${type === 'create' ? 'create' : 'update'} ledger: ${error.message}`
        )
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.wallet.ledgers)[typeof type]>['body']
  >()
    .ui({
      namespace: 'apps.wallet',
      icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
      title: `ledgers.${type}`,
      submitButton: type,
      onClose
    })
    .typesMap({
      icon: 'icon',
      name: 'text',
      color: 'color'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Ledger name',
        icon: 'tabler:book',
        placeholder: 'My Ledgers'
      },
      icon: {
        required: true,
        label: 'Ledger icon'
      },
      color: {
        required: true,
        label: 'Ledger color'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyLedgerModal
