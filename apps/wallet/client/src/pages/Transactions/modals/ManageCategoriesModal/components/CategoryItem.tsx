import forgeAPI from '@/utils/forgeAPI'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenu,
  ContextMenuItem,
  useModalStore
} from 'lifeforge-ui'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import type { WalletCategory } from '../../..'
import ModifyCategoryModal from '../../ModifyCategoryModal'

function CategoryItem({ category }: { category: WalletCategory }) {
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
          queryClient.invalidateQueries({
            queryKey: ['wallet', 'categories']
          })
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
      confirmationButton: 'delete',
      onConfirm: async () => {
        await deleteMutation.mutateAsync({})
      }
    })
  }, [])

  return (
    <li
      key={category.id}
      className="flex-between component-bg-lighter bg-bg-50 shadow-custom flex gap-3 rounded-md p-4"
    >
      <div className="flex w-full min-w-0 items-center gap-3">
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
        <div className="w-full min-w-0">
          <p className="w-full min-w-0 truncate text-lg font-medium">
            {category.name}
          </p>
          <p className="text-bg-500 text-sm">
            {category.amount} {t('transactionCount')}
          </p>
        </div>
      </div>
      <ContextMenu>
        <ContextMenuItem
          icon="tabler:pencil"
          label="Edit"
          onClick={handleEditCategory}
        />
        <ContextMenuItem
          dangerous
          icon="tabler:trash"
          label="Delete"
          onClick={handleDeleteCategory}
        />
      </ContextMenu>
    </li>
  )
}

export default CategoryItem
