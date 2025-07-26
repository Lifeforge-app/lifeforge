import { Icon } from '@iconify/react/dist/iconify.js'
import {
  DeleteConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import ModifyCategoryModal from '../../ModifyCategoryModal'

function CategorySectionItem({
  category
}: {
  category: ISchemaWithPB<WalletCollectionsSchemas.ICategoryAggregated>
}) {
  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const handleEditCategory = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'update',
      initialData: category
    })
  }, [category])

  const handleDeleteCategory = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/categories',
      confirmationText: 'Delete this category',
      data: category,
      itemName: 'category',
      nameKey: 'name' as const,
      queryKey: ['wallet', 'categories']
    })
  }, [])

  return (
    <li key={category.id} className="flex-between flex gap-3 px-2 py-4">
      <div className="flex items-center gap-3">
        <div
          className="rounded-md p-2"
          style={{
            backgroundColor: category.color + '20'
          }}
        >
          <Icon
            className="size-7"
            icon={category.icon}
            style={{
              color: category.color
            }}
          />
        </div>
        <div>
          <p className="text-lg font-medium">{category.name}</p>
          <p className="text-bg-500 text-sm">
            {category.amount} {t('transactionCount')}
          </p>
        </div>
      </div>
      <HamburgerMenu>
        <MenuItem
          icon="tabler:pencil"
          text="Edit"
          onClick={handleEditCategory}
        />
        <MenuItem
          isRed
          icon="tabler:trash"
          text="Delete"
          onClick={handleDeleteCategory}
        />
      </HamburgerMenu>
    </li>
  )
}

export default CategorySectionItem
