import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { type InferInput, useForgeMutation } from '@lifeforge/api'
import { useModuleTranslation } from '@lifeforge/localization'
import {
  CurrencyField,
  DateField,
  FileField,
  FormModal,
  ListboxField,
  LocationField,
  TAILWIND_PALETTE,
  TextField,
  convertFormFileFieldData,
  createDefaultValues,
  fileValueSchema,
  getFormFileFieldInitialData,
  useModalStore
} from '@lifeforge/ui'

import { useWalletData } from '@/hooks/useWalletData'
import { forgeAPI } from '@/manifest'
import ModifyAssetModal from '@/pages/Assets/modals/ModifyAssetModal'
import ModifyLedgerModal from '@/pages/Ledgers/modals/ModifyLedgerModal'

import type { WalletTransaction } from '..'
import CreateAnotherField, {
  CREATE_ANOTHER_OPTIONS,
  type CreateAnotherValue,
  createAnotherSchema
} from '../components/CreateAnotherFIeld'
import ModifyCategoryModal from './ModifyCategoryModal'

const schema = z
  .object({
    type: z.enum(['income', 'expenses', 'transfer']),
    createAnother: createAnotherSchema,
    date: z.date(),
    amount: z.number().positive('Amount must be positive'),
    from: z.string().optional(),
    to: z.string().optional(),
    particulars: z.string().optional(),
    category: z.string().optional(),
    asset: z.string().optional(),
    ledgers: z.array(z.string()).optional(),
    location: z
      .object({
        name: z.string(),
        formattedAddress: z.string(),
        location: z.object({
          latitude: z.number(),
          longitude: z.number()
        })
      })
      .optional(),
    receipt: fileValueSchema
  })
  .superRefine((data, ctx) => {
    if (data.type === 'transfer') {
      if (!data.from) {
        ctx.addIssue({
          code: 'custom',
          message: 'Source asset is required',
          path: ['from']
        })
      }

      if (!data.to) {
        ctx.addIssue({
          code: 'custom',
          message: 'Destination asset is required',
          path: ['to']
        })
      }
    } else {
      if (!data.particulars) {
        ctx.addIssue({
          code: 'custom',
          message: 'Particulars is required',
          path: ['particulars']
        })
      }

      if (!data.category) {
        ctx.addIssue({
          code: 'custom',
          message: 'Category is required',
          path: ['category']
        })
      }

      if (!data.asset) {
        ctx.addIssue({
          code: 'custom',
          message: 'Asset is required',
          path: ['asset']
        })
      }
    }
  })

function ModifyTransactionsModal({
  data: { type, initialData, createAnother = 'none', onSubmit },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: {
      type: WalletTransaction['type']
    } & Partial<WalletTransaction>
    createAnother?: CreateAnotherValue
    onSubmit?: (
      data: InferInput<typeof forgeAPI.transactions.create>['body']
    ) => void | Promise<void>
  }
  onClose: () => void
}) {
  const { t } = useModuleTranslation()
  const { open } = useModalStore()
  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const createMutation = useForgeMutation(forgeAPI.transactions.create, {
    action: 'create',
    queryKey: forgeAPI.key
  })

  const updateMutation = useForgeMutation(
    forgeAPI.transactions.update.input({ id: initialData?.id || ''! }),
    { action: 'update', queryKey: forgeAPI.key }
  )

  const form = useForm({
    defaultValues: {
      ...createDefaultValues(schema),
      createAnother,
      type: initialData?.type || 'income',
      date: initialData ? dayjs(initialData.date).toDate() : dayjs().toDate(),
      amount: initialData?.amount || 0,
      receipt: getFormFileFieldInitialData(
        forgeAPI,
        initialData as Record<string, unknown> | undefined,
        initialData?.receipt
      ),
      ...(initialData?.type === 'transfer'
        ? {
            from: initialData?.from,
            to: initialData?.to
          }
        : {
            asset: initialData?.asset,
            category: initialData?.category,
            ledgers: initialData?.ledgers,
            particulars: initialData?.particulars,
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
          })
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const watchedType = useWatch({ control: form.control, name: 'type' })

  const isTransfer = watchedType === 'transfer'

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
        handler: async data => {
          const finalData =
            data.type === 'transfer'
              ? {
                  type: 'transfer' as const,
                  date: dayjs(data.date).format('YYYY-MM-DD'),
                  from: data.from!,
                  to: data.to!,
                  receipt: convertFormFileFieldData(data.receipt),
                  amount: data.amount
                }
              : {
                  type: data.type,
                  date: dayjs(data.date).format('YYYY-MM-DD'),
                  asset: data.asset!,
                  category: data.category!,
                  ledgers: data.ledgers ?? [],
                  location: data.location ?? null,
                  particulars: data.particulars!,
                  receipt: convertFormFileFieldData(data.receipt),
                  amount: data.amount
                }

          if (onSubmit) {
            if (finalData.receipt === 'keep') {
              finalData.receipt = initialData?.receipt || ''
            } else if (finalData.receipt === 'removed') {
              finalData.receipt = ''
            }

            await onSubmit(finalData)
            onClose()

            return
          }

          const createAnother = data.createAnother

          if (data.type === 'transfer') {
            await (
              type === 'create' ? createMutation : updateMutation
            ).mutateAsync(finalData)
          } else {
            await (
              type === 'create' ? createMutation : updateMutation
            ).mutateAsync(finalData)
          }

          onClose()

          if (createAnother === 'none') {
            return
          }

          const option = CREATE_ANOTHER_OPTIONS.find(
            o => o.value === createAnother
          )

          if (option?.component) {
            open(option.component, {
              ...(option.data as object),
              createAnother
            } as never)
          }
        },
        template: type
      }}
      uiConfig={{
        icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
        namespace: 'apps.lifeforge--wallet',
        title: `transactions.${type}`,
        onClose
      }}
    >
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
          },
          {
            text: t('transactionTypes.transfer'),
            value: 'transfer',
            icon: 'tabler:transfer',
            color: TAILWIND_PALETTE.blue[500]
          }
        ]}
      />
      <DateField
        required
        control={form.control}
        icon="tabler:calendar"
        label="Date"
        name="date"
      />
      <CurrencyField
        required
        control={form.control}
        icon="tabler:currency-dollar"
        label="Amount"
        name="amount"
      />
      {isTransfer ? (
        <>
          <ListboxField
            required
            control={form.control}
            icon="tabler:arrow-left-circle"
            label="From Asset"
            name="from"
            options={assetOptions}
          />
          <ListboxField
            required
            control={form.control}
            icon="tabler:arrow-right-circle"
            label="To Asset"
            name="to"
            options={assetOptions}
          />
        </>
      ) : (
        <>
          <TextField
            required
            control={form.control}
            icon="tabler:file-description"
            label="Particulars"
            name="particulars"
            placeholder="Enter details about the transaction"
          />
          <ListboxField
            required
            actionButtonOption={{
              text: t('common.buttons:new', {
                item: t('items.category')
              }),
              icon: 'tabler:plus',
              onClick: () => {
                open(ModifyCategoryModal, {
                  type: 'create',
                  initialData: {
                    type: watchedType === 'income' ? 'income' : 'expenses'
                  }
                })
              }
            }}
            control={form.control}
            icon="tabler:category"
            label="Category"
            name="category"
            options={categoryOptions}
          />
          <ListboxField
            required
            actionButtonOption={{
              text: t('common.buttons:new', {
                item: t('items.asset')
              }),
              icon: 'tabler:plus',
              onClick: () => {
                open(ModifyAssetModal, { type: 'create' })
              }
            }}
            control={form.control}
            icon="tabler:coin"
            label="Asset"
            name="asset"
            options={assetOptions}
          />
          <ListboxField
            multiple
            actionButtonOption={{
              text: t('common.buttons:new', {
                item: t('items.ledger')
              }),
              icon: 'tabler:plus',
              onClick: () => {
                open(ModifyLedgerModal, { type: 'create' })
              }
            }}
            control={form.control}
            icon="tabler:book"
            label="Ledger"
            name="ledgers"
            options={ledgerOptions}
          />
          <LocationField
            control={form.control}
            label="Location"
            name="location"
          />
        </>
      )}
      <FileField
        control={form.control}
        icon="tabler:receipt"
        label="Receipt"
        mimeTypes={{
          image: ['png', 'jpeg', 'webp'],
          application: ['pdf']
        }}
        name="receipt"
      />
      {type === 'create' && <CreateAnotherField control={form.control} />}
    </FormModal>
  )
}

export default ModifyTransactionsModal
