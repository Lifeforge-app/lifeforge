import { Icon } from '@iconify/react'
import { DeleteConfirmationModal, HamburgerMenu, MenuItem } from 'lifeforge-ui'
import { useModalStore } from 'lifeforge-ui'
import { useCallback } from 'react'

import { IWalletCategory } from '@apps/Wallet/interfaces/wallet_interfaces'

import ModifyCategoryModal from '../../ModifyCategoryModal'

function CategorySectionItem({ category }: { category: IWalletCategory }) {
  const open = useModalStore(state => state.open)

  const handleEditCategory = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'update',
      existedData: category
    })
  }, [category])

  const handleDeleteCategory = useCallback(() => {
    open(DeleteConfirmationModal, {
      apiEndpoint: 'wallet/categories',
      confirmationText: 'Delete this category',
      data: category,
      itemName: 'category',
      nameKey: 'name',
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
            className="size-6"
            icon={category.icon}
            style={{
              color: category.color
            }}
          />
        </div>
        <div className="font-semibold">{category.name}</div>
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
