import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { type IWalletCategory } from '../../../../interfaces/wallet_interfaces'

function ModifyCategoryModal({
  data: { type, existedData },
  onClose
}: {
  data: {
    type: 'income' | 'expenses' | 'update' | null
    existedData: IWalletCategory | null
  }
  onClose: () => void
}) {
  const { t } = useTranslation('apps.wallet')
  const [formState, setFormState] = useState<{
    type: 'income' | 'expenses'
    name: string
    icon: string
    color: string
  }>({
    type: 'income',
    name: '',
    icon: '',
    color: ''
  })

  const FIELDS: IFieldProps<typeof formState>[] = [
    {
      id: 'type',
      label: 'Category type',
      icon: 'tabler:apps',
      type: 'listbox',
      disabled: type === 'update',
      required: true,
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
    {
      id: 'name',
      label: 'Category name',
      required: true,
      icon: 'tabler:pencil',
      placeholder: 'My Categories',
      type: 'text'
    },
    {
      id: 'icon',
      label: 'Category icon',
      required: true,
      type: 'icon'
    },
    {
      id: 'color',
      label: 'Category color',
      required: true,
      type: 'color'
    }
  ]

  useEffect(() => {
    if (type) {
      if (type === 'update') {
        if (existedData) {
          setFormState({
            type: existedData.type,
            name: existedData.name,
            icon: existedData.icon,
            color: existedData.color
          })
        }
      } else {
        setFormState({
          type: 'income',
          name: '',
          icon: '',
          color: ''
        })
      }
    }
  }, [type, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/categories"
      fields={FIELDS}
      icon={type === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      id={existedData?.id}
      namespace="apps.wallet"
      openType={type === 'update' ? 'update' : 'create'}
      queryKey={['wallet', 'categories']}
      setData={setFormState}
      title={`categories.${type === 'update' ? 'update' : 'create'}`}
      onClose={onClose}
    />
  )
}

export default ModifyCategoryModal
