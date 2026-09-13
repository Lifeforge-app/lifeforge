import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useModuleTranslation } from '@lifeforge/localization'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  toast,
  useModalStore
} from '@lifeforge/ui'

import ModifyCategoriesModal from '@/components/modals/ModifyCategoriesModal'
import { forgeAPI } from '@/manifest'

import type { PasswordCategory } from '../../..'
import useFilter from '../../../hooks/useFilter'

function CategoryItem({ category }: { category: PasswordCategory }) {
  const { open } = useModalStore()
  const { updateFilter, filter } = useFilter()
  const queryClient = useQueryClient()
  const { t } = useModuleTranslation()

  const deleteMutation = useMutation(
    forgeAPI.categories.remove.input({ id: category.id }).mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: forgeAPI.categories.list.key
        })
        queryClient.invalidateQueries({
          queryKey: forgeAPI.entries.list.key
        })
      },
      onError: () => {
        toast.error(t('toasts.categoryDeleteFailed'))
      }
    })
  )

  return (
    <SidebarItem
      key={category.id}
      active={filter.category === category.id}
      contextMenuItems={
        <>
          <ContextMenuItem
            icon="tabler:pencil"
            label="Edit"
            onClick={() => {
              open(ModifyCategoriesModal, {
                modifyType: 'update',
                initialData: category
              })
            }}
          />
          <ContextMenuItem
            dangerous
            icon="tabler:trash"
            label="Delete"
            onClick={() => {
              open(ConfirmationModal, {
                title: 'Delete Category',
                description:
                  'Are you sure you want to delete this category? This action cannot be undone.',
                confirmButton: 'Delete',
                onConfirm: async () => {
                  await deleteMutation.mutateAsync(undefined)
                }
              })
            }}
          />
        </>
      }
      icon={category.icon}
      label={category.name}
      namespace={false}
      number={category.amount}
      sideStripColor={category.color}
      onCancelButtonClick={() => {
        updateFilter('category', null)
      }}
      onClick={() => {
        updateFilter('category', category.id)
      }}
    />
  )
}

export default CategoryItem
