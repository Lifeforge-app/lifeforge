import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FormModal } from '@lifeforge/ui'
import { type IFieldProps } from '@lifeforge/ui'

import { type IWalletCategory } from '../../../../interfaces/wallet_interfaces'

function ModifyCategoriesModal({
  openType,
  setOpenType,
  existedData
}: {
  openType: 'income' | 'expenses' | 'update' | null
  setOpenType: React.Dispatch<
    React.SetStateAction<'income' | 'expenses' | 'update' | null>
  >
  existedData: IWalletCategory | null
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
      disabled: openType === 'update',
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
    if (openType) {
      if (openType === 'update') {
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
  }, [openType, existedData])

  return (
    <FormModal
      data={formState}
      endpoint="wallet/categories"
      fields={FIELDS}
      icon={openType === 'update' ? 'tabler:pencil' : 'tabler:plus'}
      id={existedData?.id}
      isOpen={openType !== null}
      namespace="apps.wallet"
      queryKey={['wallet', 'categories']}
      setData={setFormState}
      title={`categories.${openType === 'update' ? 'update' : 'create'}`}
      onClose={() => {
        setOpenType(null)
      }}
    />
  )
}

export default ModifyCategoriesModal
