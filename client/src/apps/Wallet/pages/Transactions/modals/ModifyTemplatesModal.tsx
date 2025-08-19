import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { type InferInput } from 'shared'
import colors from 'tailwindcss/colors'

import {
  type WalletTemplate,
  useWalletData
} from '@apps/Wallet/hooks/useWalletData'

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
  const { t } = useTranslation('apps.wallet')

  const queryClient = useQueryClient()

  const { categoriesQuery, assetsQuery, ledgersQuery } = useWalletData()

  const [transactionType, setTransactionType] = useState<'income' | 'expenses'>(
    initialData?.type ?? 'income'
  )

  const assets = assetsQuery.data ?? []

  const categories = categoriesQuery.data ?? []

  const ledgers = ledgersQuery.data ?? []

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wallet.templates.create
      : forgeAPI.wallet.templates.update.input({
          id: initialData?.id || ''!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'templates'] })
      },
      onError: error => {
        toast.error(`Failed to ${type} template: ${error.message}`)
      }
    })
  )

  const formProps = defineForm<
    InferInput<(typeof forgeAPI.wallet.templates)[typeof type]>['body']
  >({
    namespace: 'apps.wallet',
    title: `templates.${type}`,
    icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
    submitButton: type,
    onClose
  })
    .typesMap({
      type: 'listbox',
      name: 'text',
      particulars: 'text',
      amount: 'number',
      asset: 'listbox',
      category: 'listbox',
      ledgers: 'listbox',
      location: 'location'
    })
    .setupFields({
      name: {
        required: true,
        label: 'Template Name',
        icon: 'tabler:pencil',
        placeholder: 'My Template'
      },
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
          }
        ],
        icon: 'tabler:exchange',
        required: true
      },
      particulars: {
        label: 'Particulars',
        required: true,
        icon: 'tabler:file-description',
        placeholder: 'Enter details about the transaction'
      },
      amount: {
        label: 'Amount',
        type: 'currency',
        icon: 'tabler:currency-dollar'
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
      }
    })
    .initialData({
      ...initialData,
      type: initialData?.type ?? 'income'
    })
    .onChange(data => {
      setTransactionType(data.type)
    })
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyTemplatesModal
