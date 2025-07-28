import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import forgeAPI from '@utils/forgeAPI'
import {
  ConfirmationModal,
  HamburgerMenu,
  MenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { WalletCategory } from '../../..'
import ModifyCategoryModal from '../../ModifyCategoryModal'
import { toast } from 'react-toastify'

function CategorySectionItem({ category }: { category: WalletCategory }) {
  const queryClient = useQueryClient()

  const open = useModalStore(state => state.open)

  const { t } = useTranslation('apps.wallet')

  const handleEditCategory = useCallback(() => {
    open(ModifyCategoryModal, {
      type: 'update',
      initialData: category
    })
  }, [category])

  const deleteMutation = useMutation(
    forgeAPI.wallet.categories.remove
      .input({ id: category.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['wallet', 'categories'] })
        },
        onError: () => {
          toast.error('Failed to delete category')
        }
      })
  )

  const handleDeleteCategory = useCallback(() => {
    open(ConfirmationModal, {
      title: 'Delete Category',
      description: 'Are you sure you want to delete this category?',
      buttonType: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
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
