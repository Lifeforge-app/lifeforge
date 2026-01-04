import type { AchievementCategory } from '@'
import ModifyCategoriesModal from '@/components/modals/ModifyCategoriesModal'
import useFilter from '@/hooks/useFilter'
import forgeAPI from '@/utils/forgeAPI'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ConfirmationModal,
  ContextMenuItem,
  SidebarItem,
  useModalStore
} from 'lifeforge-ui'
import { toast } from 'react-toastify'

function CategoryItem({ category }: { category: AchievementCategory }) {
  const open = useModalStore(state => state.open)

  const { updateFilter, filter } = useFilter()

  const queryClient = useQueryClient()

  const deleteMutation = useMutation(
    forgeAPI.achievements.categories.remove
      .input({ id: category.id })
      .mutationOptions({
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ['achievements', 'categories']
          })
        },
        onError: () => {
          toast.error('Failed to delete category. Please try again.')
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
                  await deleteMutation.mutateAsync({})
                }
              })
            }}
          />
        </>
      }
      icon={category.icon}
      label={category.name}
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
