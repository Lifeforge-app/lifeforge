import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import dayjs from 'dayjs'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type { InferInput } from 'shared'
import colors from 'tailwindcss/colors'

import { useWalletData } from '@apps/Wallet/hooks/useWalletData'

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
  const queryClient = useQueryClient()

  const { assetsQuery, categoriesQuery, ledgersQuery } = useWalletData()

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const [transactionType, setTransactionType] = useState<
    'income' | 'expenses' | 'transfer'
  >(initialData?.type ?? 'income')

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

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.wallet.transactions)[typeof type]>['body']
  >()
    .ui({
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
            text: 'Income',
            value: 'income',
            icon: 'tabler:login-2',
            color: colors.green[500]
          },
          {
            text: 'Expenses',
            value: 'expenses',
            icon: 'tabler:logout-2',
            color: colors.red[500]
          },
          {
            text: 'Transfer',
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
        placeholder: 'Enter details about the transaction',
        hidden: transactionType === 'transfer'
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
        icon: 'tabler:arrow-left-circle',
        hidden: transactionType !== 'transfer'
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
        icon: 'tabler:arrow-right-circle',
        hidden: transactionType !== 'transfer'
      },
      category: {
        multiple: false,
        label: 'Category',
        options: categories
          .filter(cat => cat.type === transactionType)
          .map(category => ({
            text: category.name,
            value: category.id,
            icon: category.icon,
            color: category.color
          })),
        icon: 'tabler:category',
        required: true,
        hidden: transactionType === 'transfer'
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
        required: true,
        hidden: transactionType === 'transfer'
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
        icon: 'tabler:book',
        hidden: transactionType === 'transfer'
      },
      location: {
        label: 'Location',
        hidden: transactionType === 'transfer'
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
    .onChange(data => {
      setTransactionType(data.type)
    })
    .onSubmit(async data => {
      console.log(data)

      if (data.type === 'transfer') {
        await mutation.mutateAsync({
          type: 'transfer',
          date: data.date,
          from: data.from,
          to: data.to,
          receipt: data.receipt,
          amount: data.amount
        })
      } else {
        await mutation.mutateAsync({
          type: data.type,
          date: data.date,
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
