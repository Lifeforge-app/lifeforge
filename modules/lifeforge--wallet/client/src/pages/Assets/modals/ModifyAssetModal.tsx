import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import {
  CurrencyField,
  FormModal,
  IconField,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import type { WalletAsset } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  icon: z.string().min(1, 'Asset icon is required'),
  starting_balance: z.number()
})

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
  const createMutation = useForgeMutation(forgeAPI.assets.create, {
    action: 'create',
    queryKey: forgeAPI.assets.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.assets.update.input({ id: initialData?.id || '' }),
    { action: 'update', queryKey: forgeAPI.assets.key }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: async data => {
          await (
            type === 'create' ? createMutation : updateMutation
          ).mutateAsync(data)
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.lifeforge--wallet',
        title: `assets.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:wallet"
        label="Asset name"
        name="name"
        placeholder="My assets"
      />
      <IconField
        required
        control={form.control}
        label="Asset icon"
        name="icon"
      />
      <CurrencyField
        required
        control={form.control}
        icon="tabler:currency-dollar"
        label="Initial Balance"
        name="starting_balance"
      />
    </FormModal>
  )
}

export default ModifyAssetModal
