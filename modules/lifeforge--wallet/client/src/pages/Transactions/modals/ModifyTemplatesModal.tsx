import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  CurrencyField,
  FormModal,
  ListboxField,
  LocationField,
  TAILWIND_PALETTE,
  TextField,
  createDefaultValues
} from '@lifeforge/ui'

import { type WalletTemplate, useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'

const schema = z.object({
  name: z.string().min(1, 'Template name is required'),
  type: z.enum(['income', 'expenses']),
  particulars: z.string().min(1, 'Particulars is required'),
  amount: z.number(),
  asset: z.string().min(1, 'Asset is required'),
  category: z.string().min(1, 'Category is required'),
  ledgers: z.array(z.string()),
  location: z
    .object({
      name: z.string(),
      formattedAddress: z.string(),
      location: z.object({
        latitude: z.number(),
        longitude: z.number()
      })
    })
    .optional()
})

function ModifyTemplatesModal({
  onClose,
  data: { type, initialData }
}: {
  onClose: () => void
  data: {
    type: 'create' | 'update'
    initialData?: Partial<WalletTemplate>
  }
}) {
  const { t } = useModuleTranslation()
  const { categoriesQuery, assetsQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const createMutation = useForgeMutation(forgeAPI.templates.create, {
    action: 'create',
    queryKey: forgeAPI.templates.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.templates.update.input({ id: initialData?.id || ''! }),
    { action: 'update', queryKey: forgeAPI.templates.key }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      ...initialData,
      type: initialData?.type ?? 'income',
      location: initialData?.location_name
        ? {
            name: initialData?.location_name || '',
            location: {
              latitude: initialData?.location_coords?.lat || 0,
              longitude: initialData?.location_coords?.lon || 0
            },
            formattedAddress: initialData?.location_name || ''
          }
        : undefined
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const watchedType = useWatch({ control: form.control, name: 'type' })

  const categoryOptions = categories
    .filter(cat => cat.type === watchedType)
    .map(category => ({
      text: category.name,
      value: category.id,
      icon: category.icon,
      color: category.color
    }))

  const assetOptions = assets.map(asset => ({
    text: asset.name,
    value: asset.id,
    icon: asset.icon
  }))

  const ledgerOptions = ledgers.map(ledger => ({
    text: ledger.name,
    value: ledger.id,
    icon: ledger.icon,
    color: ledger.color
  }))

  return (
    <FormModal
      form={form}
      submissionConfig={{
        handler: data => {
          ;(type === 'create' ? createMutation : updateMutation).mutateAsync(
            data
          )
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
        namespace: 'apps.lifeforge--wallet',
        title: `templates.${type}`,
        onClose
      }}
    >
      <TextField
        required
        control={form.control}
        icon="tabler:pencil"
        label="Template Name"
        name="name"
        placeholder="My Template"
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:exchange"
        label="Transaction Type"
        name="type"
        options={[
          {
            text: t('transactionTypes.income'),
            value: 'income',
            icon: 'tabler:login-2',
            color: TAILWIND_PALETTE.green[500]
          },
          {
            text: t('transactionTypes.expenses'),
            value: 'expenses',
            icon: 'tabler:logout-2',
            color: TAILWIND_PALETTE.red[500]
          }
        ]}
      />
      <TextField
        required
        control={form.control}
        icon="tabler:file-description"
        label="Particulars"
        name="particulars"
        placeholder="Enter details about the transaction"
      />
      <CurrencyField
        control={form.control}
        icon="tabler:currency-dollar"
        label="Amount"
        name="amount"
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:category"
        label="Category"
        name="category"
        options={categoryOptions}
      />
      <ListboxField
        required
        control={form.control}
        icon="tabler:coin"
        label="Asset"
        name="asset"
        options={assetOptions}
      />
      <ListboxField
        multiple
        control={form.control}
        icon="tabler:book"
        label="Ledger"
        name="ledgers"
        options={ledgerOptions}
      />
      <LocationField control={form.control} label="Location" name="location" />
    </FormModal>
  )
}

export default ModifyTemplatesModal
