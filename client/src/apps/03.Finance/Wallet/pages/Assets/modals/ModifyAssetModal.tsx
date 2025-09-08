import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'

import type { WalletAsset } from '@apps/03.Finance/wallet/hooks/useWalletData'

function ModifyAssetModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: WalletAsset
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wallet.assets.create
      : forgeAPI.wallet.assets.update.input({
          id: initialData?.id || ''
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'assets'] })
      },
      onError: error => {
        toast.error(
          `Failed to ${type === 'create' ? 'create' : 'update'} asset: ${error.message}`
        )
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.wallet.assets)[typeof type]>['body']
  >({
    namespace: 'apps.wallet',
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `assets.${type}`,
    submitButton: type,
    onClose
  })
    .typesMap({
      icon: 'icon',
      name: 'text',
      starting_balance: 'number'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Asset name',
        icon: 'tabler:wallet',
        placeholder: 'My assets'
      },
      icon: {
        required: true,
        label: 'Asset icon'
      },
      starting_balance: {
        required: true,
        label: 'Initial Balance',
        icon: 'tabler:currency-dollar',
        placeholder: '0.00'
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyAssetModal
