import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import type { InferInput } from 'lifeforge-api'
import { FormModal, defineForm } from 'lifeforge-ui'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import type { WalletCategory } from '..'

function ModifyCategoryModal({
  data: { type, initialData },
  onClose
}: {
  data: {
    type: 'create' | 'update'
    initialData?: Partial<WalletCategory>
  }
  onClose: () => void
}) {
  const queryClient = useQueryClient()

  const { t } = useTranslation('apps.wallet')

  const mutation = useMutation(
    (type === 'create'
      ? forgeAPI.wallet.categories.create
      : forgeAPI.wallet.categories.update.input({
          id: initialData!.id!
        })
    ).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
      },
      onError: error => {
        toast.error(
          `Failed to ${type === 'create' ? 'create' : 'update'} category: ${error.message}`
        )
      }
    })
  )

  const formProps = defineForm<
    InferInput<
      (typeof forgeAPI.wallet.categories)[typeof type extends 'update'
        ? 'update'
        : 'create']
    >['body']
  >()
    .ui({
      namespace: 'apps.wallet',
      icon: type === 'update' ? 'tabler:pencil' : 'tabler:plus',
      title: `categories.${type === 'update' ? 'update' : 'create'}`,
      submitButton: type === 'update' ? 'update' : 'create',
      onClose
    })
    .typesMap({
      type: 'listbox',
      icon: 'icon',
      name: 'text',
      color: 'color'
    })
    .setupFields({
      type: {
        multiple: false,
        required: true,
        disabled: type === 'update',
        label: t('categoryType'),
        icon: 'tabler:apps',
        options: [
          {
            value: 'income',
            text: t('transactionTypes.income'),
            icon: 'tabler:login-2',
            color: 'green'
          },
          {
            value: 'expenses',
            text: t('transactionTypes.expenses'),
            icon: 'tabler:logout',
            color: 'red'
          }
        ]
      },
      name: {
        required: true,
        label: t('categoryName'),
        icon: 'tabler:pencil',
        placeholder: t('categoryNamePlaceholder')
      },
      icon: {
        required: true,
        label: t('categoryIcon')
      },
      color: {
        required: true,
        label: t('categoryColor')
      }
    })
    .initialData(initialData)
    .onSubmit(async data => {
      await mutation.mutateAsync(data)
    })
    .build()

  return <FormModal {...formProps} />
}

export default ModifyCategoryModal
