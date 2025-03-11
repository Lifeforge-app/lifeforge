import { Icon } from '@iconify/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { HamburgerMenu, MenuItem } from '@lifeforge/ui'

import { type IWalletCategory } from '@interfaces/wallet_interfaces'

interface CategorySectionProps {
  categories: IWalletCategory[]
  type: 'income' | 'expenses'
  iconName: string
  setModifyCategoriesModalOpenType: React.Dispatch<
    React.SetStateAction<'income' | 'expenses' | 'update' | null>
  >
  setExistedData: (category: IWalletCategory) => void
  setDeleteCategoriesConfirmationOpen: (isOpen: boolean) => void
}

function CategorySection({
  categories,
  type,
  iconName,
  setModifyCategoriesModalOpenType,
  setExistedData,
  setDeleteCategoriesConfirmationOpen
}: CategorySectionProps): React.ReactElement {
  const { t } = useTranslation('modules.wallet')
  const filteredCategories = categories.filter(
    category => category.type === type
  )

  return (
    <>
      <div className="flex-between flex gap-4">
        <h2 className="text-bg-500 flex items-center gap-2 text-lg font-medium">
          <Icon className="size-6" icon={iconName} />
          {t('transactionTypes.' + type)}
        </h2>
        <button
          className="text-bg-500 hover:bg-bg-100 hover:text-bg-800 dark:hover:bg-bg-800 dark:hover:text-bg-50 rounded-lg p-2 transition-all"
          onClick={() => {
            setModifyCategoriesModalOpenType(type)
          }}
        >
          <Icon className="size-5" icon="tabler:plus" />
        </button>
      </div>
      <ul className="divide-bg-200 dark:divide-bg-800 mb-4 flex flex-col divide-y">
        {filteredCategories.length > 0 ? (
          filteredCategories.map(category => (
            <li key={category.id} className="flex-between flex gap-4 px-2 py-4">
              <div className="flex items-center gap-4">
                <div
                  className="rounded-md p-2"
                  style={{
                    backgroundColor: category.color + '20'
                  }}
                >
                  <Icon
                    className="size-6"
                    icon={category.icon}
                    style={{
                      color: category.color
                    }}
                  />
                </div>
                <div className="font-semibold">{category.name}</div>
              </div>
              <HamburgerMenu className="relative">
                <MenuItem
                  icon="tabler:pencil"
                  text="Edit"
                  onClick={() => {
                    setExistedData(category)
                    setModifyCategoriesModalOpenType('update')
                  }}
                />
                <MenuItem
                  isRed
                  icon="tabler:trash"
                  text="Delete"
                  onClick={() => {
                    setExistedData(category)
                    setDeleteCategoriesConfirmationOpen(true)
                  }}
                />
              </HamburgerMenu>
            </li>
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
