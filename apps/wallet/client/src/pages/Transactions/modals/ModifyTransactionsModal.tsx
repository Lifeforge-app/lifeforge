import { useWalletData } from '@/hooks/useWalletData'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'
import colors from 'tailwindcss/colors'

import type { WalletTransaction } from '..'

function ModifyTransactionsModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: {
      type: WalletTransaction['type']
    } & Partial<WalletTransaction>
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.wallet')

  const queryClient = useQueryClient()

  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wallet.transactions.create
      : forgeAPI.wallet.transactions.update.input({
          id: initialData?.id || ''!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet'] })
      },
      onError: error => {
        toast.error('Failed to modify transaction:', error)
      }
    })
  )

  const { formProps } = defineForm<
    InferInput<(typeof forgeAPI.wallet.transactions)[typeof type]>['body']
  >({
    namespace: 'apps.wallet',
    icon: type === 'create' ? 'tabler:plus' : 'tabler:pencil',
    title: `transactions.${type}`,
    submitButton: type,
    onClose
  })
    .typesMap({
      type: 'listbox',
      date: 'datetime',
      amount: 'currency',
      from: 'listbox',
      to: 'listbox',
      particulars: 'text',
      category: 'listbox',
      asset: 'listbox',
      ledgers: 'listbox',
      location: 'location',
      receipt: 'file'
    })
    .setupFields({
      type: {
        multiple: false,
        label: 'Transaction Type',
        options: [
          {
            text: t('transactionTypes.income'),
            value: 'income',
            icon: 'tabler:login-2',
            color: colors.green[500]
          },
          {
            text: t('transactionTypes.expenses'),
            value: 'expenses',
            icon: 'tabler:logout-2',
            color: colors.red[500]
          },
          {
            text: t('transactionTypes.transfer'),
            value: 'transfer',
            icon: 'tabler:transfer',
            color: colors.blue[500]
          }
        ],
        icon: 'tabler:exchange',
        required: true
      },
      date: {
        required: true,
        label: 'Date',
        icon: 'tabler:calendar'
      },
      particulars: {
        label: 'Particulars',
        required: true,
        icon: 'tabler:file-description',
        placeholder: 'Enter details about the transaction'
      },
      amount: {
        required: true,
        label: 'Amount',
        icon: 'tabler:currency-dollar',
        placeholder: 'Enter amount'
      },
      from: {
        required: true,
        multiple: false,
        label: 'From Asset',
        options: assets.map(asset => ({
          text: asset.name,
          value: asset.id,
          icon: asset.icon
        })),
        icon: 'tabler:arrow-left-circle'
      },
      to: {
        required: true,
        multiple: false,
        label: 'To Asset',
        options: assets.map(asset => ({
          text: asset.name,
          value: asset.id,
          icon: asset.icon
        })),
        icon: 'tabler:arrow-right-circle'
      },
      category: {
        multiple: false,
        label: 'Category',
        options: value =>
          categories
            .filter(cat => cat.type === value.type)
            .map(category => ({
              text: category.name,
              value: category.id,
              icon: category.icon,
              color: category.color
            })),
        icon: 'tabler:category',
        required: true
      },
      asset: {
        multiple: false,
        label: 'Asset',
        options: assets.map(asset => ({
          text: asset.name,
          value: asset.id,
          icon: asset.icon
        })),
        icon: 'tabler:coin',
        required: true
      },
      ledgers: {
        multiple: true,
        label: 'Ledger',
        options: ledgers.map(ledger => ({
          text: ledger.name,
          value: ledger.id,
          icon: ledger.icon,
          color: ledger.color
        })),
        icon: 'tabler:book'
      },
      location: {
        label: 'Location'
      },
      receipt: {
        label: 'Receipt',
        icon: 'tabler:receipt',
        optional: true,
        acceptedMimeTypes: {
          images: ['image/png', 'image/jpeg', 'image/webp'],
          documents: ['application/pdf']
        }
      }
    })
    .conditionalFields({
      asset: data => data.type !== 'transfer',
      category: data => data.type !== 'transfer',
      ledgers: data => data.type !== 'transfer',
      particulars: data => data.type !== 'transfer',
      location: data => data.type !== 'transfer',
      from: data => data.type === 'transfer',
      to: data => data.type === 'transfer'
    })
    .initialData({
      type: initialData?.type || 'income',
      date: initialData ? dayjs(initialData.date).toDate() : dayjs().toDate(),
      amount: initialData?.amount || 0,
      receipt: {
        file:
          typeof initialData?.receipt === 'string' &&
          initialData?.receipt.length > 0
            ? 'keep'
            : (initialData?.receipt as File | undefined) instanceof File
              ? (initialData!.receipt as unknown as File)
              : null,
        preview: initialData?.receipt
          ? typeof initialData?.receipt === 'string'
            ? forgeAPI.media.input({
                collectionId: initialData.collectionId!,
                recordId: initialData.id!,
                fieldId: initialData!.receipt
              }).endpoint
            : (initialData?.receipt as File | undefined) instanceof File
              ? URL.createObjectURL(initialData!.receipt as unknown as File)
              : null
          : null
      },
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
            location: {
              name: initialData?.location_name || '',
              location: {
                latitude: initialData?.location_coords?.lat || 0,
                longitude: initialData?.location_coords?.lon || 0
              },
              formattedAddress: initialData?.location_name || ''
            }
          })
    })
    .onSubmit(async data => {
      if (data.type === 'transfer') {
        await mutation.mutateAsync({
          type: 'transfer',
          date: dayjs(data.date).format('YYYY-MM-DD'),
          from: data.from,
          to: data.to,
          receipt: data.receipt,
          amount: data.amount
        })
      } else {
        await mutation.mutateAsync({
          type: data.type,
          date: dayjs(data.date).format('YYYY-MM-DD'),
          asset: data.asset,
          category: data.category,
          ledgers: data.ledgers,
          location: data.location,
          particulars: data.particulars,
          receipt: data.receipt,
          amount: data.amount
        })
      }
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTransactionsModal
