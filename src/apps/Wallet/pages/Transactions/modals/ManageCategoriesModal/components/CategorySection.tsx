import { Icon } from '@iconify/react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import { useModalStore } from '@lifeforge/ui'

import { type IWalletCategory } from '../../../../../interfaces/wallet_interfaces'
import CategorySectionItem from './CategorySectionItem'

interface CategorySectionProps {
  categories: IWalletCategory[]
  type: 'income' | 'expenses'
  iconName: string
}

function CategorySection({ categories, type, iconName }: CategorySectionProps) {
  const open = useModalStore(state => state.open)
  const { t } = useTranslation('apps.wallet')
  const filteredCategories = categories.filter(
    category => category.type === type
  )

  const handleCreateCategoryOfType = useCallback(() => {
    open('wallet.transactions.modifyCategory', {
      type,
      existedData: null
    })
  }, [type])

  return (
    <>
      <div className="flex-between flex gap-4">
        <h2 className="text-bg-500 flex items-center gap-2 text-lg font-medium">
          <Icon className="size-6" icon={iconName} />
          {t('transactionTypes.' + type)}
        </h2>
        <button
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50 rounded-lg p-2 transition-all"
          onClick={handleCreateCategoryOfType}
        >
          <Icon className="size-5" icon="tabler:plus" />
        </button>
      </div>
      <ul className="divide-bg-200 dark:divide-bg-800 mb-4 flex flex-col divide-y">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <CategorySectionItem key={category.id} category={category} />
          ))
        ) : (
          <p className="text-bg-500 text-center">
            No {type === 'income' ? 'income' : 'expenses'} categories found
          </p>
        )}
      </ul>
    </>
  )
}

export default CategorySection
